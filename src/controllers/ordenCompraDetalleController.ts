import { Request, Response } from "express";
import { prismaOrdenCompraDetalle } from "../models/ordenCompraDetalle";
import { error } from "console";
import { prismaOrdenCompra } from "../models/ordenCompra";
import { connect } from "http2";
import { prismaDetalleProducto } from "../models/detalleProducto";


export const getOrdenCompraDetalleById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const detalle = await prismaOrdenCompraDetalle.findUnique({
        where: { id },
        include: {
            ordenCompra: true,
            //detalleProducto: true,
        },
        });

        if (!detalle) {
        res.status(404).json({ error: "Detalle de orden no encontrado" });
        return;
    }

    res.status(200).json(detalle);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error al obtener el detalle" });
    }
};


export const getOrdenesCompraDetalle = async (_req: Request, res: Response): Promise<void> => {
    try {
        const detalles = await prismaOrdenCompraDetalle.findMany({
        include: {
            ordenCompra: true,
            //detalleProducto: true,
        },
        });

    res.status(200).json(detalles);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error al obtener los detalles" });
    }
};


export const createOrdenCompraDetalle = async (req: Request, res: Response): Promise<void> => {
    const { ordenCompraId, detalleProductoId, cantidad, subtotal } = req.body;

    try {
        const detalle = await prismaOrdenCompraDetalle.create({
        data: {
            ordenCompraId,
            detalleProductoId,
            cantidad,
            subtotal,
        },
    });

    res.status(201).json(detalle);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el detalle" });
    }
};


export const updateOrdenCompraDetalle = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { ordenCompraId, detalleProductoId, cantidad, subtotal, habilitado } = req.body;

    try {
        const detalleActualizado = await prismaOrdenCompraDetalle.update({
        where: { id },
        data: {
            ordenCompraId,
            detalleProductoId,
            cantidad,
            subtotal,
            habilitado,
        },
    });

    res.status(200).json(detalleActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el detalle" });
    }
};


export const deleteOrdenCompraDetalle = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prismaOrdenCompraDetalle.delete({
        where: { id },
    });

    res.status(200).json({ mensaje: "Detalle eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el detalle" });
    }
};

export const toggleHabilitadoOrdenCompraDetalle = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const detalle = await prismaOrdenCompraDetalle.findUnique({ where: { id } });

        if (!detalle) {
        res.status(404).json({ error: "Detalle no encontrado" });
        return;
    }

        const detalleActualizado = await prismaOrdenCompraDetalle.update({
        where: { id },
        data: { habilitado: !detalle.habilitado },
        });

    res.status(200).json({ mensaje: "Estado actualizado", detalle: detalleActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al alternar el estado" });
    }
};


export const getEnabledOrdenComprasDetalle = async (_req: Request, res: Response): Promise<void> => {
    try {
        const detalles = await prismaOrdenCompraDetalle.findMany({
        where: { habilitado: true },
        include: {
            ordenCompra: true,
            //detalleProducto: true,
        },
    });

    res.status(200).json(detalles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles habilitados" });
    }
};




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