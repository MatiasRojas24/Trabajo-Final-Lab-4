import { Request, Response } from "express";
import { prismaPrecio } from "../models/precio";
import { prismaDetalleProducto } from "../models/detalleProducto";
import { connect } from "http2";
import { prismaDescuento } from "../models/descuento";

export const addDetalleProducto = async (req: Request, res: Response): Promise <void> => {
    const {idPrecio} = req.params;
    const {idDetalleProducto} = req.body;

    try {
        const precio = await prismaPrecio.findUnique({
            where:{id:idPrecio}
        })

        if (!precio){
            res.status(404).json({error: 'Precio no existe'})
            return
        }
        const detalleProducto = await prismaDetalleProducto.findUnique({
            where: { id: idDetalleProducto }
        });
        if (!detalleProducto) {
            res.status(404).json({ error: 'Detalle producto no encontrado' });
            return;
        }

        await prismaPrecio.update({
            where: { id: idPrecio },
            data: {
                detalleProducto: {
                    connect: {id: idDetalleProducto}
                }
            }
        })
        res.status(200).json({ mensaje: 'Detalle producto agregado a precio correctamente' });
    } catch (error) {
        res.status(500).json({ error: "Error al habilitar/deshabilitar el usuario" })
    }
}
export const addDescuento = async (req: Request, res: Response): Promise<void> => {
    const {precioId} = req.params
    const {descuentoId} = req.body;


    try {
        const precio = await prismaPrecio.findUnique({
            where: {id: precioId},
        })
        if (!precio){
            res.status(404).json({error: 'Precio no existe'})
            return
        }
        const descuento = await prismaDescuento.findUnique({
            where: {id: descuentoId}
        })
        if (!descuento){
            res.status(404).json({error: 'Descuento no existe'})
            return
        }

        await prismaPrecio.update({
                    where: {id: precioId},
                    data: {
                        descuento: {
                            connect: {id: descuentoId }
                        }
                    }
                })
        res.status(200).json({mensaje: 'Descuento agregado al precio correctamente'})
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el descuento al precio" })
    }
}

export const listarPorDetalleProducto = async (req: Request, res: Response): Promise<void> => {
    const { detalleProductoId } = req.params;

    try {
        const precios = await prismaPrecio.findMany({
            where: {
                detalleProductoId: detalleProductoId,
            },
            include: {
                detalleProducto: true,
            }
        });

        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar precios por detalle producto' });
    }
};

export const listarPorDescuento = async (req: Request, res: Response): Promise<void> => {
    const { descuentoId } = req.params;

    try {
        const precios = await prismaPrecio.findMany({
            where: {
                descuentoId: descuentoId,
            },
            include: {
                descuento: true,
            }
        });

        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar precios por descuento' });
    }
};