import { Request, Response } from "express";
import imagenPrisma from '../models/imagen'
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import detalleProductoPrisma from "../models/detalleProducto"

export const createImagen = async (req: Request, res: Response): Promise<void> => {
    const { url } = req.body

    // crear funcion para generar id
    const publicIdGenerated = nanoid(7)

    try {
        if (!url) {
            res.status(400).json({ mesagge: "Falta uno de los datos obligatorios" })
            return
        }

        const nuevaImagen = await imagenPrisma.create({
            data: {
                publicId: publicIdGenerated,
                url,
            } as Prisma.ImagenCreateInput // ==> Le decimos a TS que 'data' cumple con el modelo de Imagen previamente definido
        })

        res.status(201).json(nuevaImagen)
    } catch (error) {
        console.log("Hubo un erro al crear la imagen: ", error)
        res.status(500).json({ message: "Error al crear la imagen" })
    }
}

export const getImagenes = async (req: Request, res: Response): Promise<void> => {
    try {
        const imagenes = await imagenPrisma.findMany({ include: { detalleProducto: true } });
        res.status(200).json(imagenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las imagenes' });
    }
}

export const getEnabledImagenes = async (req: Request, res: Response): Promise<void> => {
    try {
        const enabled = await imagenPrisma.findMany({
            where: { habilitado: true }
        });

        res.status(200).json(enabled);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las imagenes' });
    }
}

export const getImagenById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        const imagen = await imagenPrisma.findUnique({
            where: { id: id },
            include: {
                detalleProducto: true
            },
        })

        res.status(200).json(imagen)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la imagen' });
    }
}

export const toggleEnableImagen = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        const imagen = await imagenPrisma.findUnique({ where: { id: id } })

        if (!imagen) {
            res.status(404).json({ message: "Imagen no encontrada" })
            return;
        }

        await imagenPrisma.update({
            where: { id: id },
            data: { habilitado: !imagen.habilitado }
        })

        res.status(200).json({ message: "Imagen deshabilitada/habilitada con exito" })
    } catch (error) {
        res.status(500).json({ error: 'Error al habilitar/deshabilitar la imagen' });
    }
}

export const updateImagen = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { publicId, url, detalleProductoId, habilitado } = req.body;

  try {
    // Validar si la imagen existe
    const imagenExistente = await imagenPrisma.findUnique({
      where: { id },
    });

    if (!imagenExistente) {
        res.status(404).json({ error: 'Imagen no encontrada' });
        return;
    }

    // Actualizar
    const imagenActualizada = await imagenPrisma.update({
      where: { id },
      data: {
        publicId: publicId ?? imagenExistente.publicId,
        url: url ?? imagenExistente.url,
        detalleProductoId: detalleProductoId ?? imagenExistente.detalleProductoId,
        habilitado: habilitado ?? imagenExistente.habilitado,
      },
      include: {
        detalleProducto: true
      }
    });

    res.status(200).json(imagenActualizada);
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar la imagen' });
  }
};

export const deleteImagen = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        await imagenPrisma.delete({
            where: { id: id }
        })

        res.status(200).json({ message: "Imagen eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}

export const addDetalleProductoToImagen = async (req: Request, res: Response) => {
    const { imgId } = req.params;
    const { detalleProductoId } = req.body;

    try {
        // Verificamos existencia del detalle producto
        const detalleProducto = await detalleProductoPrisma.findUnique({
            where: { id: detalleProductoId },
        });

        if (!detalleProducto || !detalleProducto.habilitado) {
            res.status(404).json({ error: 'Detalle de producto no encontrado o no habilitado' });
            return;
        }

        // Verificamos existencia de la imagen
        const imagen = await imagenPrisma.findUnique({
            where: { id: imgId },
        });

        if (!imagen) {
            res.status(404).json({ error: 'Imagen no encontrado' });
            return;
        }

        // Asociamos el detalle producto
        const imagenActualizada = await imagenPrisma.update({
            where: { id: imgId },
            data: { detalleProductoId },
            include: {
                detalleProducto: true,
            },
        });

        res.status(200).json(imagenActualizada)
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el detalle producto' });
    }
}

export const getImagenByDetalleProductoId = async (req: Request, res: Response) => {
    const { dpId } = req.params

    try {
        const detalleProducto = await detalleProductoPrisma.findUnique({
            where: { id: dpId },
            include: { Imagen: true }
        })

        if (!detalleProducto) {
            res.status(404).json({ message: "Detalle producto no encontrado" })
            return;
        }

        res.status(200).json(detalleProducto.Imagen)
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}