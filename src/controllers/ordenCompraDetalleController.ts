import { Request, Response } from "express";
import { prismaOrdenCompraDetalle } from "../models/ordenCompraDetalle";
import { error } from "console";
import { prismaOrdenCompra } from "../models/ordenCompra";
import { connect } from "http2";
import { prismaDetalleProducto } from "../models/detalleProducto";

export const addOrdenCompra = async (req: Request , res: Response): Promise<void> => {
    const {ordenCompraDetalleId} = req.params;
    const {ordenCompraId} = req.body;

    try {
        const ordenCompraDetalle = await prismaOrdenCompraDetalle.findUnique({
            where: {id: ordenCompraDetalleId}
        })
        if (!ordenCompraDetalle) {
            res.status(404).json({ error: 'Orden de compra detalle no existe'})
            return
        }

        const ordenCompra = await prismaOrdenCompra.findUnique({
            where: {id: ordenCompraId}
        });

        if(!ordenCompra) {
            res.status(404).json({error: 'Orden Compra no encontrado'})
            return
        }

        await prismaOrdenCompraDetalle.update({
            where: {id: ordenCompraDetalleId},
            data: {
                ordenCompra:{
                    connect:{id: ordenCompraId}
                }
            }
        });
        res.status(200).json({ mensaje: 'Orden Compra agregada correctamente a la Orden Compra Detalle'})
    } catch (error) {
        res.status(500).json({error: 'Error al agregar orden compra a orden compra detalle'})
    }
}

export const addDetalleProducto = async (req: Request, res: Response): Promise<void> => {
    const {ordenCompraDetalleId} = req.params;
    const {detalleProductoId} = req.body;

    try {
        const ordenCompraDetalle = await prismaOrdenCompraDetalle.findUnique({
            where: {id: ordenCompraDetalleId}
        })
        if (!ordenCompraDetalle) {
            res.status(404).json({ error: 'Orden de compra detalle no existe'})
            return
        }

        const detalleProducto = await prismaDetalleProducto.findUnique({
            where: {id: detalleProductoId}
        })
        if (!detalleProducto) {
            res.status(404).json({error: 'Detalle Producto no encontrado'})
            return 
}

        await prismaOrdenCompraDetalle.update({
            where: {id: ordenCompraDetalleId},
            data: {
                detalleProducto:{
                    connect:{id: detalleProductoId}
                }
            }
        });
        res.status(200).json({mensaje: "Detalle Producto agregado correctamente a la orden compra detalle"})
    } catch (error) {
        res.status(500).json({ error: "Error al agregar detalle producto a la orden compra detalle" })
    }
}

export const listarPorOrdenCompra = async (req: Request, res: Response): Promise<void> => {
    const {ordenCompraId} = req.params;

    try {
        const ordenesComprasDetalle = await prismaOrdenCompraDetalle.findMany({
            where: {
                ordenCompraId: ordenCompraId,
            },
            include: {
                ordenCompra: true,
            }
        });
        res.status(200).json({ mensaje: 'Orden Compra agregada correctamente a la Orden Compra Detalle' });
    }catch(error){
        res.status(500).json({ error: 'Error al agregar orden compra a orden compra detalle' });
    }
}

export const listarPorDetalleProducto = async (req: Request, res:Response): Promise<void> => {
    const {detalleProductoId} = req.params;

    try {
        const ordenesCompraDetalles = await prismaOrdenCompraDetalle.findMany({
            where: {
                detalleProductoId: detalleProductoId,
            },
            include: {
                detalleProducto: true,
            }
        })
        res.status(200).json({ mensaje: 'Detalle Producto agregado correctamente a la orden compra detalle' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar detalle producto a la orden compra detalle' });
    }
}