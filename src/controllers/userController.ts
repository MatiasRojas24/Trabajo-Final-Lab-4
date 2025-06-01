import { prismaUsuario } from '../models/usuario'
import { prismaDireccion } from '../models/direccion'
import { Request, Response } from 'express'
import { hashPassword } from '../services/passwordService'

export const getEnabledUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prismaUsuario.findMany({
            where: {
                habilitado: true,
            }
        });
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios habilitados' })
    }
}

export const toggleEnabled = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const usuario = await prismaUsuario.findUnique({
            where: {
                id: id,
            }
        })
        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }
        const updatedUser = await prismaUsuario.update({
            where: {
                id: id
            },
            data: {
                habilitado: !usuario.habilitado
            }
        })
        res.status(200).json({ mensaje: "Estado del usuario cambiado correctamente" })
    } catch (error) {
        res.status(500).json({ error: "Error al habilitar/deshabilitar el usuario" })
    }
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prismaUsuario.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const usuario = await prismaUsuario.findUnique({
            where: {
                id,
            },
        });

        if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { email, nombre, password, dni, } = req.body;

    try {
        const existingUser = await prismaUsuario.findUnique({
            where: { id }
        });

        if (!existingUser) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        let hashedPassword: string | undefined = undefined;
        if (password) {
            hashedPassword = await hashPassword(password);
        }

        const updatedUser = await prismaUsuario.update({
            where: { id },
            data: {
                email,
                nombre,
                ...(hashedPassword && { password: hashedPassword }),
                dni,
            }
        });
        
        res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prismaUsuario.delete({
            where: { id: id },
        });

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
};

export const addDireccionesToUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { direccionIds } = req.body;

    try {
        const user = await prismaUsuario.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const direccionesExistentes = await prismaDireccion.findMany({
            where: {
                id: { in: direccionIds }
            },
            select: { id: true }
        });

        const idsExistentes = direccionesExistentes.map(d => d.id);
        const idsInvalidos = direccionIds.filter((id: string) => !idsExistentes.includes(id));

        if (idsInvalidos.length > 0) {
            res.status(400).json({ error: `Las siguientes direcciones no existen: ${idsInvalidos.join(', ')}` });
            return;
        }

        await prismaUsuario.update({
            where: { id: userId },
            data: {
                direcciones: {
                    connect: direccionIds.map((id: string) => ({ id }))
                }
            }
        });

        res.status(200).json({ mensaje: 'Direcciones agregadas al usuario correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar direcciones al usuario' });
    }
};

export const getUsersByDireccionId = async (req: Request, res: Response): Promise<void> => {
    const { direccionId } = req.params;

    try {
        const direccion = await prismaDireccion.findUnique({
            where: { id: direccionId },
            include: {
                usuarios: true
            }
        });

        if (!direccion) {
            res.status(404).json({ error: 'Dirección no encontrada' });
            return;
        }

        res.status(200).json(direccion.usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios por dirección' });
    }
};