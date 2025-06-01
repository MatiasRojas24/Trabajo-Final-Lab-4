import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getEnabledCatalogos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const catalogos = await prisma.catalogo.findMany({
      where: {
        habilitado: true,
      },
    });
    res.status(200).json(catalogos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener catálogos habilitados" });
  }
};

export const toggleEnabledCatalogo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const catalogo = await prisma.catalogo.findUnique({
      where: { id },
    });

    if (!catalogo) {
      res.status(404).json({ error: "Catálogo no encontrado" });
      return;
    }

    const updatedCatalogo = await prisma.catalogo.update({
      where: { id },
      data: {
        habilitado: !catalogo.habilitado,
      },
    });

    res
      .status(200)
      .json({ mensaje: "Estado del catálogo cambiado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al habilitar/deshabilitar el catálogo" });
  }
};

export const getCatalogos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const catalogos = await prisma.catalogo.findMany({
      include: {
        Producto: true,
      },
    });
    res.status(200).json(catalogos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los catálogos" });
  }
};

export const getCatalogoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const catalogo = await prisma.catalogo.findUnique({
      where: { id },
      include: {
        Producto: true,
      },
    });

    if (!catalogo) {
      res.status(404).json({ error: "Catálogo no encontrado" });
      return;
    }

    res.status(200).json(catalogo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el catálogo" });
  }
};

export const createCatalogo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nombre } = req.body;

  try {
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
      res.status(400).json({
        error:
          "El nombre del catálogo es requerido y debe ser una cadena no vacía",
      });
      return;
    }

    const existingCatalogo = await prisma.catalogo.findFirst({
      where: { nombre: nombre.trim() },
    });

    if (existingCatalogo) {
      res.status(400).json({ error: "Ya existe un catálogo con ese nombre" });
      return;
    }

    const newCatalogo = await prisma.catalogo.create({
      data: {
        nombre: nombre.trim(),
        habilitado: true,
      },
    });

    res.status(201).json(newCatalogo);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "El catálogo ya existe" });
    } else {
      res.status(500).json({ error: "Error al crear el catálogo" });
    }
  }
};

export const updateCatalogo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    if (nombre && (typeof nombre !== "string" || nombre.trim() === "")) {
      res
        .status(400)
        .json({ error: "El nombre del catálogo debe ser una cadena no vacía" });
      return;
    }

    const existingCatalogo = await prisma.catalogo.findUnique({
      where: { id },
    });

    if (!existingCatalogo) {
      res.status(404).json({ error: "Catálogo no encontrado" });
      return;
    }

    if (nombre) {
      const catalogoWithSameName = await prisma.catalogo.findFirst({
        where: {
          nombre: nombre.trim(),
          id: { not: id },
        },
      });

      if (catalogoWithSameName) {
        res
          .status(400)
          .json({ error: "Ya existe otro catálogo con ese nombre" });
        return;
      }
    }

    const updatedCatalogo = await prisma.catalogo.update({
      where: { id },
      data: {
        nombre: nombre ? nombre.trim() : undefined,
      },
    });

    res.status(200).json(updatedCatalogo);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "El catálogo ya existe" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Catálogo no encontrado" });
    } else {
      res.status(500).json({ error: "Error al actualizar el catálogo" });
    }
  }
};

export const deleteCatalogo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const catalogo = await prisma.catalogo.findUnique({
      where: { id },
      include: { Producto: true },
    });

    if (!catalogo) {
      res.status(404).json({ error: "Catálogo no encontrado" });
      return;
    }

    if (catalogo.Producto.length > 0) {
      res.status(400).json({
        error:
          "No se puede eliminar el catálogo porque está asociado a productos",
      });
      return;
    }

    await prisma.catalogo.delete({
      where: { id },
    });

    res.status(200).json({ mensaje: "Catálogo eliminado correctamente" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "Catálogo no encontrado" });
    } else {
      res.status(500).json({ error: "Error al eliminar el catálogo" });
    }
  }
};
