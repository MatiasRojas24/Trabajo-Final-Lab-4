import { Request, Response } from "express";
import { prismaDireccion } from "../models/direccion";
import { prismaUsuario } from "../models/usuario";


export const getEnabledDirecciones = async (req: Request, res: Response): Promise<void> => {
    try {
        const direcciones = await prismaDireccion.findMany({
            where: {
                habilitado: true
            }
        });
        res.status(200).json(direcciones)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener direcciones habilitadas' })
    }
}

export const toggleEnabled = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const direccion = await prismaDireccion.findUnique({
            where: {
                id: id
            }
        })
        if (!direccion) {
            res.status(404).json({ error: 'Dirección no encontrada' })
            return
        }
        const updatedDireccion = await prismaDireccion.update({
            where: {
                id: id
            },
            data: {
                habilitado: !direccion.habilitado
            }
        })
        res.status(200).json({ mensaje: 'Estado de la dirección cambiado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al habilitar/deshabilitar la dirección' })
    }
}

export const getDirecciones = async (req: Request, res: Response): Promise<void> => {
    try {
        const direcciones = await prismaDireccion.findMany()
        res.status(200).json(direcciones)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las direcciones' })
    }
}

export const getDireccionById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const direccion = await prismaDireccion.findUnique({
            where: {
                id,
            }
        })
        if (!direccion) {
            res.status(404).json({ error: 'Dirección no encontrada' })
            return
        }
        res.status(200).json(direccion)
    } catch (error) {
        res.status(500).json({ error: 'Problemas al obtener la dirección' })
    }
}

export const createDireccion = async (req: Request, res: Response): Promise<void> => {
    const { localidad, pais, provincia, departamento } = req.body;
    try {
        if (!localidad) {
            res.status(400).json({ mensaje: 'La localidad es obligatorio' })
            return
        }
        if (!pais) {
            res.status(400).json({ mensaje: 'El país es obligatorio' })
            return
        }
        if (!provincia) {
            res.status(400).json({ mensaje: 'La provincia es obligatoria' })
            return
        }
        if (!departamento) {
            res.status(400).json({ mensaje: 'El departamento es obligatorio' })
            return
        }
        const direccion = await prismaDireccion.create(
            {
                data: {
                    localidad,
                    pais,
                    provincia,
                    departamento
                }
            }
        )
        res.status(201).json(direccion)
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al crear la dirección' })
    }
}

export const updatedDireccion = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { localidad, pais, provincia, departamento } = req.body
    try {
        const existingDireccion = await prismaDireccion.findUnique({
            where: { id }
        })
        if (!existingDireccion) {
            res.status(404).json({ error: 'Dirección no encontrada' })
            return
        }
        const updatedDireccion = await prismaDireccion.update({
            where: { id },
            data: {
                localidad,
                pais,
                provincia,
                departamento
            }
        })
        res.status(200).json(updatedDireccion)
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al actualizar la dirección' })
    }
}

export const deleteDireccion = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        await prismaDireccion.delete({
            where: { id: id }
        })
        res.status(200).json({ mensaje: 'Dirección eliminada correctamente' })
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Dirección no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error al eliminar la dirección' })
        }
    }
}

export const addUsuariosToDireccion = async (req: Request, res: Response): Promise<void> => {
    const { direccionId } = req.params;
    const { usuarioIds } = req.body;

    try {
        const direccion = await prismaDireccion.findUnique({
            where: { id: direccionId }
        });

        if (!direccion) {
            res.status(404).json({ error: 'Dirección no encontrada' });
            return;
        }

        const usuariosExistentes = await prismaUsuario.findMany({
            where: {
                id: { in: usuarioIds }
            },
            select: { id: true }
        });

        const idsExistentes = usuariosExistentes.map(u => u.id);
        const idsInvalidos = usuarioIds.filter((id: string) => !idsExistentes.includes(id));

        if (idsInvalidos.length > 0) {
            res.status(400).json({ error: `Los siguientes usuarios no existen: ${idsInvalidos.join(', ')}` });
            return;
        }

        await prismaDireccion.update({
            where: { id: direccionId },
            data: {
                usuarios: {
                    connect: idsExistentes.map((id: string) => ({ id }))
                }
            }
        });

        res.status(200).json({ mensaje: 'Usuarios agregados a la dirección correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar usuarios a la dirección' });
    }
};


export const getDireccionesByUserId = async (req: Request, res: Response): Promise<void> => {
    const { usuarioId } = req.params;
    try {
        const usuario = await prismaUsuario.findUnique({
            where: { id: usuarioId },
            include: {
                direcciones: true
            }
        })
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }
        res.status(200).json(usuario.direcciones)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener direcciones por usuario' })
    }
}