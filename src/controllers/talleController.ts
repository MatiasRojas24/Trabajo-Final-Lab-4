import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getEnabledTalles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const talles = await prisma.talle.findMany({
      where: {
        habilitado: true,
      },
    });
    res.status(200).json(talles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener talles habilitados" });
  }
};

export const toggleEnabledTalle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const talle = await prisma.talle.findUnique({
      where: { id },
    });

    if (!talle) {
      res.status(404).json({ error: "Talle no encontrado" });
      return;
    }

    const updatedTalle = await prisma.talle.update({
      where: { id },
      data: {
        habilitado: !talle.habilitado,
      },
    });

    res
      .status(200)
      .json({ mensaje: "Estado del talle cambiado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al habilitar/deshabilitar el talle" });
  }
};

export const getTalles = async (req: Request, res: Response): Promise<void> => {
  try {
    const talles = await prisma.talle.findMany({
      include: {
        DetalleProducto: true,
      },
    });
    res.status(200).json(talles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los talles" });
  }
};

export const getTalleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const talle = await prisma.talle.findUnique({
      where: { id },
      include: {
        DetalleProducto: true,
      },
    });

    if (!talle) {
      res.status(404).json({ error: "Talle no encontrado" });
      return;
    }

    res.status(200).json(talle);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el talle" });
  }
};

export const createTalle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { talle } = req.body;

  try {
    if (!talle || typeof talle !== "number") {
      res.status(400).json({ error: "El talle debe ser un número entero" });
      return;
    }

    const existingTalle = await prisma.talle.findFirst({
      where: { talle },
    });

    if (existingTalle) {
      res.status(400).json({ error: "Ya existe un talle con ese valor" });
      return;
    }

    const newTalle = await prisma.talle.create({
      data: {
        talle,
        habilitado: true,
      },
    });

    res.status(201).json(newTalle);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "El talle ya existe" });
    } else {
      res.status(500).json({ error: "Error al crear el talle" });
    }
  }
};

export const updateTalle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { talle } = req.body;

  try {
    if (talle && typeof talle !== "number") {
      res.status(400).json({ error: "El talle debe ser un número entero" });
      return;
    }

    const existingTalle = await prisma.talle.findUnique({
      where: { id },
    });

    if (!existingTalle) {
      res.status(404).json({ error: "Talle no encontrado" });
      return;
    }

    const talleWithSameValue = await prisma.talle.findFirst({
      where: {
        talle,
        id: { not: id },
      },
    });

    if (talleWithSameValue) {
      res.status(400).json({ error: "Ya existe otro talle con ese valor" });
      return;
    }

    const updatedTalle = await prisma.talle.update({
      where: { id },
      data: {
        talle,
      },
    });

    res.status(200).json(updatedTalle);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "El talle ya existe" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Talle no encontrado" });
    } else {
      res.status(500).json({ error: "Error al actualizar el talle" });
    }
  }
};

export const deleteTalle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const talle = await prisma.talle.findUnique({
      where: { id },
      include: { DetalleProducto: true },
    });

    if (!talle) {
      res.status(404).json({ error: "Talle no encontrado" });
      return;
    }

    if (talle.DetalleProducto.length > 0) {
      res.status(400).json({
        error: "No se puede eliminar el talle porque está asociado a productos",
      });
      return;
    }

    await prisma.talle.delete({
      where: { id },
    });

    res.status(200).json({ mensaje: "Talle eliminado correctamente" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "Talle no encontrado" });
    } else {
      res.status(500).json({ error: "Error al eliminar el talle" });
    }
  }
};
