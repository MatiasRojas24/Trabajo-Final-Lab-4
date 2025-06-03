import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

// Definimos los valores válidos de los enums manualmente
const SEXO_VALUES = ["HOMBRE", "MUJER", "OTRO"] as const;
const TIPO_PRODUCTO_VALUES = [
  "ZAPATILLA",
  "REMERA",
  "PANTALON",
  "CAMPERA",
] as const;

type Sexo = (typeof SEXO_VALUES)[number];
type TipoProducto = (typeof TIPO_PRODUCTO_VALUES)[number];

const prisma = new PrismaClient();

export const getEnabledProductos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        habilitado: true,
      },
      include: {
        catalogo: true,
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos habilitados" });
  }
};

export const toggleEnabledProducto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    await prisma.producto.update({
      where: { id },
      data: { habilitado: !producto.habilitado },
    });

    res
      .status(200)
      .json({ mensaje: "Estado del producto cambiado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al habilitar/deshabilitar el producto" });
  }
};

export const getProductos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        catalogo: true,
        DetalleProducto: true,
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const getProductoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        catalogo: true,
        DetalleProducto: true,
      },
    });

    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

export const createProducto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nombre, sexo, tipoProducto, catalogoId } = req.body;
  try {
    // Validar sexo y tipoProducto
    if (sexo && !SEXO_VALUES.includes(sexo)) {
      res.status(400).json({ error: "Valor inválido para sexo" });
      return;
    }
    if (tipoProducto && !TIPO_PRODUCTO_VALUES.includes(tipoProducto)) {
      res.status(400).json({ error: "Valor inválido para tipoProducto" });
      return;
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        sexo,
        tipoProducto,
        catalogoId,
        habilitado: true,
      },
      include: {
        catalogo: true,
      },
    });

    res.status(201).json(producto);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "El producto ya existe" });
    } else if (error?.code === "P2003") {
      res.status(400).json({ error: "El catálogo especificado no existe" });
    } else {
      res.status(500).json({ error: "Error al crear el producto" });
    }
  }
};

export const updateProducto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { nombre, sexo, tipoProducto, catalogoId } = req.body;

  try {
    // Validar sexo y tipoProducto
    if (sexo && !SEXO_VALUES.includes(sexo)) {
      res.status(400).json({ error: "Valor inválido para sexo" });
      return;
    }
    if (tipoProducto && !TIPO_PRODUCTO_VALUES.includes(tipoProducto)) {
      res.status(400).json({ error: "Valor inválido para tipoProducto" });
      return;
    }

    const existingProducto = await prisma.producto.findUnique({
      where: { id },
    });

    if (!existingProducto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const updatedProducto = await prisma.producto.update({
      where: { id },
      data: {
        nombre,
        sexo,
        tipoProducto,
        catalogoId,
      },
      include: {
        catalogo: true,
        DetalleProducto: true,
      },
    });

    res.status(200).json(updatedProducto);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(400).json({ error: "El producto ya existe" });
    } else if (error?.code === "P2003") {
      res.status(400).json({ error: "El catálogo especificado no existe" });
    } else if (error?.code === "P2025") {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  }
};

export const deleteProducto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.producto.delete({
      where: { id },
    });

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }
};

export const agregarCatalogo = async (req: Request, res: Response): Promise<void> => {
  const { idProducto } = req.params;
  const { catalogoId } = req.body;

  try {
    const producto = await prisma.producto.findUnique({
      where: { id: idProducto },
    });

    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    const catalogo = await prisma.catalogo.findUnique({
      where: { id: catalogoId },
    });

    if (!catalogo) {
      res.status(404).json({ error: "Catálogo no encontrado" });
      return;
    }

    if (producto.catalogoId === catalogoId) {
      res.status(409).json({ message: "El catalogo que estas intentando colocar, ya existe, saludos crack" })
      return;
    }

    const updatedProducto = await prisma.producto.update({
      where: { id: idProducto },
      data: {
        catalogoId,
      },
      include: {
        catalogo: true,
        DetalleProducto: true,
      },
    });

    res.status(200).json(updatedProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al asignar catálogo al producto" });
  }
};

export const listarPorCatalogo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const catalogo = await prisma.catalogo.findUnique({
      where: { id },
      include: {
        Producto: {
          include: {
            DetalleProducto: true,
          },
        },
      },
    });

    if (!catalogo) {
      res.status(404).json({ error: "Catálogo no encontrado" });
      return;
    }

    res.status(200).json(catalogo.Producto);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos por catálogo" });
  }
};

export const filtrarProductos = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nombre, sexo, tipoProducto, idCatalogo } = req.query;

  try {
    // Validar que sexo y tipoProducto sean valores válidos
    const validSexo =
      sexo && SEXO_VALUES.includes(sexo as Sexo) ? (sexo as Sexo) : undefined;
    const validTipoProducto =
      tipoProducto &&
      TIPO_PRODUCTO_VALUES.includes(tipoProducto as TipoProducto)
        ? (tipoProducto as TipoProducto)
        : undefined;

    const productos = await prisma.producto.findMany({
      where: {
        AND: [
          nombre
            ? { nombre: { contains: nombre as string, mode: "insensitive" } }
            : {},
          validSexo ? { sexo: validSexo } : {},
          validTipoProducto ? { tipoProducto: validTipoProducto } : {},
          idCatalogo ? { catalogoId: idCatalogo as string } : {},
        ],
      },
      include: {
        catalogo: true,
        DetalleProducto: true,
      },
    });

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al filtrar productos" });
  }
};
