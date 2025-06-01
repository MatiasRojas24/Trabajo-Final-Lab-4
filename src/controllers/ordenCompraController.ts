import { Request, Response } from "express";
import { prismaOrdenCompra } from "../models/ordenCompra";
import prisma from "../lib/prisma";
import { prismaUsuario } from "../models/usuario";
import { prismaDireccion } from "../models/direccion";
import { error } from "console";
import { connect } from "http2";

export const addUserOrdenCompra  = async (req: Request, res: Response): Promise<void> =>{
    const {ordenCompraId} = req.params;
    const { usuarioId } = req.body;

    try{
        const ordenCompra = await prismaOrdenCompra.findUnique({
            where: {id:ordenCompraId},
        })
        if(!ordenCompra){
            res.status(404).json({error: 'Orden de compra no existe'})
            return
        }
        const usuario = await prismaUsuario.findUnique({
            where: { id: usuarioId }
        });
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        await prismaOrdenCompra.update({
            where: { id: ordenCompraId },
            data: {
                usuario: {
                    connect: { id: usuarioId }
                }
            }
        });
            res.status(200).json({ mensaje: 'Usuario agregado a la orden de compra correctamente' });
    }catch(error){
        res.status(500).json({ error: "Error al habilitar/deshabilitar el usuario" })
    }

}


export const addDireccionOrdenCompra = async (req: Request, res: Response): Promise<void> => {
    const {ordenCompraId} = req.params;
    const {direccionId} = req.body;

    try {
        const ordenCompra = await prismaOrdenCompra.findUnique({
            where: {id: ordenCompraId}
        })
        if(!ordenCompra){
            res.status(404).json({error: 'Orden de compra no existe'})
            return
        }
        const direccion = await prismaDireccion.findUnique({
            where:{id: direccionId}
        })
        if(!direccion){
            res.status(404).json({error: 'Direccion no encontrado'})
            return
        }

        await prismaOrdenCompra.update({
            where: {id: ordenCompraId},
            data: {
                direccion: {
                    connect: {id: direccionId}
                }
            }
        })
        res.status(200).json({mensaje: 'Direccion agregada a la orden compra correctamente'})
        
    } catch (error) {
        res.status(500).json({ error: "Error al agregar la direccion a la orden compra" })
    }
}

export const listarPorUsuario = async (req: Request, res: Response): Promise<void> => {
    const {usuarioId} = req.params;

    try {
        const ordenesCompras = await prismaOrdenCompra.findMany({
            where: {
                usuarioId: usuarioId,
            },
            include:{
                direccion: true,
                usuario: true
            }
        });

        res.status(200).json(ordenesCompras);
        
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes de compra del usuario' });
    }
}

export const listarPorDirecciones = async (req: Request, res:Response): Promise<void> => {
    const {direccionId} = req.params;

    try {
        const ordenesCompras = await prismaOrdenCompra.findMany({
            where:{
                direccionId: direccionId,
            },
            include: {
                direccion: true,
                usuario: true
            }
        });
        res.status(200).json(ordenesCompras);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes de compra por dirección' });
    }
}

