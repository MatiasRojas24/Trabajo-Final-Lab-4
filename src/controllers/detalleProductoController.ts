import { Request, Response } from "express";
import { Prisma, Sexo, TipoProducto } from "@prisma/client";
import prisma from "../lib/prisma";


export const createDetalleProducto = async (req: Request, res: Response): Promise<void> => {
    const { stock, color, imagenIds, precioIds, ordenCompraDetalleIds } = req.body;

    try {
        if (stock == null || !color) {
            res.status(400).json({ message: 'Faltan datos requeridos' });
            return;
        }

        const nuevoDetalleProducto = await prisma.detalleProducto.create({
            data: {
                stock,
                color,
                ...(imagenIds.length > 0 && {
                    Imagen: {
                        connect: imagenIds.map((id: string) => ({ id }))
                    }
                }),
                ...(precioIds.length > 0 && {
                    Precio: {
                        connect: precioIds.map((id: string) => ({ id }))
                    }
                }),
                ...(ordenCompraDetalleIds.length > 0 && {
                    OrdenCompraDetalle: {
                        connect: ordenCompraDetalleIds.map((id: string) => ({ id }))
                    }
                })
            } as Prisma.DetalleProductoCreateInput,
            include: {
                talle: true,
                producto: true,
                Imagen: true,
                Precio: true,
                OrdenCompraDetalle: true,
            }
        });

        res.status(201).json(nuevoDetalleProducto);
    } catch (error) {
        console.error("Error al crear detalle producto:", error);
        res.status(500).json({ message: 'Error al crear el detalle producto' });
    }
};

export const getDetallesProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const detallesProductos = await prisma.detalleProducto.findMany({
            include: {
                talle: true,
                producto: true,
                Imagen: true,
                Precio: true,
                OrdenCompraDetalle: true,
            }
        });

        res.status(200).json(detallesProductos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getDetalleProductoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const detalleProducto = await prisma.detalleProducto.findUnique({
            where: {
                id,
            },
            include: {
                talle: true,
                producto: true,
                Imagen: true,
                Precio: true,
                OrdenCompraDetalle: true,
            },
        });

        if (!detalleProducto) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json(detalleProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el detalleProducto' });
    }
};

export const getEnabledDetallesProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const enabled = await prisma.detalleProducto.findMany({
            where: { habilitado: true },
            include: {
                talle: true,
                producto: true,
                Imagen: true,
                Precio: true,
                OrdenCompraDetalle: true,
            },
        })

        res.status(200).json(enabled)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los detallesProductos' });
    }
}

export const updateDetalleProducto = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { stock, color, imagenIds, precioIds, ordenCompraDetalleIds } = req.body;

    try {
        const existingDetalleProducto = await prisma.detalleProducto.findUnique({
            where: { id }
        });

        if (!existingDetalleProducto) {
            res.status(404).json({ message: "El detalle de producto no fue encontrado" });
            return;
        }

        const updatedDetalleProducto = await prisma.detalleProducto.update({
            where: { id },
            data: {
                stock,
                color,
                ...(imagenIds?.length > 0 && {
                    Imagen: {
                        set: imagenIds.map((id: string) => ({ id }))
                    }
                }),
                ...(precioIds?.length > 0 && {
                    Precio: {
                        set: precioIds.map((id: string) => ({ id }))
                    }
                }),
                ...(ordenCompraDetalleIds?.length > 0 && {
                    OrdenCompraDetalle: {
                        set: ordenCompraDetalleIds.map((id: string) => ({ id }))
                    }
                })
            },

            include: {
                talle: true,
                producto: true,
                Imagen: true,
                Precio: true,
                OrdenCompraDetalle: true,
            }
        });

        res.status(200).json(updatedDetalleProducto);
    } catch (error) {
        console.error("Hubo un error al actualizar detalle producto: ", error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const deleteDetalleProducto = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const existing = await prisma.detalleProducto.findUnique({ where: { id } });

        if (!existing) {
            res.status(404).json({ message: 'Detalle de producto no encontrado' });
            return;
        }

        await prisma.detalleProducto.delete({ where: { id } });

        res.status(200).json({ message: 'Detalle de producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar detalle de producto:', error);
        res.status(500).json({ message: 'Hubo un error al eliminar el detalle de producto' });
    }
};

export const toggleHabilitadoDetProd = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
    const existingDetalleProducto = await prisma.detalleProducto.findUnique({
        where: { id }
    });

    if (!existingDetalleProducto) {
        res.status(404).json({ message: `Detalle de producto no encontrado` });
        return;
    }

    const detalleProductoActualizado = await prisma.detalleProducto.update({
        where: { id },
        data: {
        habilitado: !existingDetalleProducto.habilitado
        }
    });

    res.status(200).json(detalleProductoActualizado);
    } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del detalle producto' });
    }
};



export const addTalleToDetalleProducto = async (req: Request, res: Response) => {
    const { dpId } = req.params;
    const { talleId } = req.body;

    try {
    // Verificamos existencia del talle
    const talle = await prisma.talle.findUnique({
        where: { id: talleId },
    });

    if (!talle || !talle.habilitado) {
        res.status(404).json({ error: 'Talle no encontrado o no habilitado' });
        return;
    }

    // Verificamos existencia del detalleProducto
    const detalleProducto = await prisma.detalleProducto.findUnique({
        where: { id: dpId },
    });

    if (!detalleProducto) {
        res.status(404).json({ error: 'DetalleProducto no encontrado' });
        return;
    }

    // Asociamos el talle
    const updatedDetalleProducto = await prisma.detalleProducto.update({
        where: { id: dpId },
        data: { talleId },
        include: {
            talle: true,
            producto: true,
            Imagen: true,
            Precio: true,
            OrdenCompraDetalle: true,
        },
    });

    res.status(200).json(updatedDetalleProducto);
    } catch (error) {
    console.error('Error al asociar talle:', error);
    res.status(500).json({ error: 'Error del servidor al asociar el talle' });
    }
};

export const getDetalleProductoByTalle = async (req: Request, res: Response): Promise<void> => {
    const { talleId } = req.params;

    try {
        const talle = await prisma.talle.findUnique({
            where: { id: talleId },
            include: {
                DetalleProducto: true
            }
        });

        if (!talle) {
            res.status(404).json({ error: 'Talle no Encontrado' });
            return;
        }

        res.status(200).json(talle.DetalleProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener detalle de producto por talle' });
    }
};

export const addProductoToDetalleProducto = async (req: Request, res: Response): Promise<void> => {
    const { dpId } = req.params
    const { productoId } = req.body

    try {
    // Verificamos existencia del producto
    const producto = await prisma.producto.findUnique({
        where: { id: productoId },
    });

    if (!producto || !producto.habilitado) {
        res.status(404).json({ error: 'Producto no encontrado o no habilitado' });
        return;
    }

    // Verificamos existencia del detalleProducto
    const detalleProducto = await prisma.detalleProducto.findUnique({
        where: { id: dpId },
    });

    if (!detalleProducto) {
        res.status(404).json({ error: 'DetalleProducto no encontrado' });
        return;
    }

    // Asociamos el producto
    const updatedDetalleProducto = await prisma.detalleProducto.update({
        where: { id: dpId },
        data: { productoId },
            include: {
                talle: true,
                producto: true,
                Imagen: true,
                Precio: true,
                OrdenCompraDetalle: true,
        },
    });

    res.status(200).json(updatedDetalleProducto);
    } catch (error) {
    console.error('Error al asociar talle:', error);
    res.status(500).json({ error: 'Error del servidor al asociar el talle' });
    }
}

export const getDetalleProductoByProducto = async (req: Request, res: Response): Promise<void> => {
    const { productoId } = req.params;

    try {
        const producto = await prisma.producto.findUnique({
            where: { id: productoId },
            include: {
                DetalleProducto: true
            }
        });

        if (!producto) {
            res.status(404).json({ error: 'Producto no Encontrado' });
            return;
        }

        res.status(200).json(producto.DetalleProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener detalle de producto por producto' });
    }
};

export const listarProductosFiltrados = async (req: Request, res: Response) => {
    const { talleId, tipoProducto, sexo, precioMin, precioMax } = req.query;

    try {
    const productos = await prisma.producto.findMany({
        where: {
        habilitado: true,
        tipoProducto: tipoProducto && Object.values(TipoProducto).includes(tipoProducto as TipoProducto)
        ? (tipoProducto as TipoProducto)
        : undefined,

        sexo: sexo && Object.values(Sexo).includes(sexo as Sexo)
        ? (sexo as Sexo)
        : undefined,

        DetalleProducto: {
            some: {
            habilitado: true,
            talleId: talleId ? String(talleId) : undefined,
            Precio: (precioMin || precioMax)
                ? {
                    some: {
                        precioVenta: {
                            gte: precioMin ? Number(precioMin) : undefined,
                            lte: precioMax ? Number(precioMax) : undefined,
                        },
                    },
                }
                : undefined,
            },
        },
        },
        include: {
        DetalleProducto: {
            where: {
            habilitado: true,
            talleId: talleId ? String(talleId) : undefined,
            Precio: (precioMin || precioMax)
                ? {
                    some: {
                        precioVenta: {
                            gte: precioMin ? Number(precioMin) : undefined,
                            lte: precioMax ? Number(precioMax) : undefined,
                        },
                    }
                }
                : undefined,
            },
            include: {
            talle: true,
            Precio: true,
            Imagen: true,
            },
        },
        },
    });

    res.status(200).json(productos);
    } catch (error) {
    console.error('Error al listar productos filtrados:', error);
    res.status(500).json({ error: 'Error del servidor al filtrar productos' });
    }
};