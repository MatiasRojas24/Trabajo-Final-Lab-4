import { Request, Response } from "express";
import { prismaPrecio } from "../models/precio";
import { prismaDetalleProducto } from "../models/detalleProducto";
import { connect } from "http2";
import { prismaDescuento } from "../models/descuento";


export const getPrecioById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const precio = await prismaPrecio.findUnique({
            where: { id },
            include: { detalleProducto: true, descuento: true }
        });

        if (!precio) {
            res.status(404).json({ error: 'Precio no encontrado' });
            return;
        }

        res.status(200).json(precio);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el precio' });
    }
};


export const getAllPrecios = async (_req: Request, res: Response): Promise<void> => {
    try {
        const precios = await prismaPrecio.findMany({
            include: { detalleProducto: true, descuento: true }
        });
        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar precios' });
    }
};


export const createPrecio = async (req: Request, res: Response): Promise<void> => {
    const { precioCompra, precioVenta, detalleProductoId, descuentoId } = req.body;

    try {
        const nuevoPrecio = await prismaPrecio.create({
            data: {
                precioCompra,
                precioVenta,
                detalleProductoId: {connect: {id: detalleProductoId}},
                descuentoId: {connect: {id: descuentoId}}
            }
        });
        res.status(201).json(nuevoPrecio);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el precio' });
    }
};


export const updatePrecio = async (req: Request, res: Response): Promise<void> => {
    const { id, precioCompra, precioVenta, detalleProductoId, descuentoId } = req.body;

    try {
        const precioActualizado = await prismaPrecio.update({
            where: { id },
            data: {
                precioCompra,
                precioVenta,
                detalleProductoId,
                descuentoId
            }
        });

        res.status(200).json(precioActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el precio' });
    }
};


export const deletePrecio = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prismaPrecio.delete({ where: { id } });
        res.status(200).json({ mensaje: 'Precio eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el precio' });
    }
};

export const toggleHabilitado = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const precio = await prismaPrecio.findUnique({ where: { id } });

        if (!precio) {
            res.status(404).json({ error: 'Precio no encontrado' });
            return;
        }

        const precioActualizado = await prismaPrecio.update({
            where: { id },
            data: { habilitado: !precio.habilitado }
        });

        res.status(200).json({ mensaje: 'Estado de habilitado alternado correctamente', precio: precioActualizado });
    } catch (error) {
        res.status(500).json({ error: 'Error al alternar el estado' });
    }
};


export const getEnabledPrecios = async (_req: Request, res: Response): Promise<void> => {
    try {
        const precios = await prismaPrecio.findMany({
            where: { habilitado: true },
            include: { detalleProducto: true, descuento: true }
        });
        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener precios habilitados' });
    }
};


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
                descuento: true
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
                detalleProducto: true,
                descuento: true
            }
        });

        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar precios por descuento' });
    }
};