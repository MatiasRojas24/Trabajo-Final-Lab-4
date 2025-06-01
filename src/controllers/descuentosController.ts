import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createDescuento = async (req: Request, res: Response): Promise<void> => {
  const { fechaInicio, fechaCierre, descuento, precioIds } = req.body;

  try {
    if (
      !fechaInicio?.trim() ||
      !fechaCierre?.trim() ||
      descuento === undefined
    ) {
      res.status(400).json({ message: 'Falta alguno de los datos requeridos' });
      return;
    }

    const nuevoDescuento = await prisma.descuento.create({
      data: {
        fechaInicio,
        fechaCierre,
        descuento,
        ...(precioIds.length > 0 && {
            Precio: {
                connect: precioIds.map((id: string) => ({ id }))
            }
        }),
      },
      include: {
        Precio: true
      }
    });

    res.status(201).json(nuevoDescuento);
  } catch (error) {
    console.error("Error al crear descuento:", error);
    res.status(500).json({ message: 'Error al crear el descuento' });
  }
};

export const getAllDescuentos = async (req: Request, res: Response): Promise<void> => {
    try {
        const descuentos = await prisma.descuento.findMany()

        res.status(200).json(descuentos)
    } catch (error) {
        res.status(500).json({ message: 'Error al traer los descuentos' })
    }
}

export const getDescuentoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        const descuento = await prisma.descuento.findUnique({
            where: { id: id }
        })

        res.status(200).json(descuento)
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al traer el descuento" })
    }
}

export const updateDescuentos = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { fechaInicio, fechaCierre, descuento } = req.body

    try {
        const existingDescuento = prisma.descuento.findUnique({
            where: { id: id }
        })

        if (!existingDescuento) {
            res.status(404).json({ message: "El descuento no fue encontrado" })
        }

        const updatedDescuento = await prisma.descuento.update({
            where: { id },
            data: {
                fechaInicio,
                fechaCierre,
                descuento,
            }
        });
        
        res.status(200).json(updatedDescuento)
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el descuento' })
    }
}


export const deleteDescuento = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params

    try {
        await  prisma.descuento.delete({
            where: { id: id },
        });
        
        res.status(200).json({ message: "El descuento se eliminó con éxito" })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el descuento' })
    }
}

// ACTIVAR/DESCARTIVAR DESCUENTOS
export const toggleHabilitadoDescuento = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const entity = await prisma.descuento.findUnique({
      where: { id }
    });

    if (!entity) {
      res.status(404).json({ message: `Descuento no encontrado con id: ${id}` });
      return;
    }

    const updatedEntity = await prisma.descuento.update({
      where: { id },
      data: {
        habilitado: !entity.habilitado
      }
    });

    res.status(200).json(updatedEntity);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del descuento' });
  }
};

// OBTENER LOS DESCUENTOS HABILIDATOS
export const getHabilitados = async (req: Request, res: Response): Promise<void> => {
  try {
    const habilitados = await prisma.descuento.findMany({
      where: { habilitado: true, }
    });
    
    res.status(200).json(habilitados);
  } catch (error) {
    res.status(500).json({ message: 'Error al traer los descuentos habilitados' });
  }
};