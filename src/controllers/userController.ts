import prisma from '../models/usuario'
import { Request, Response } from 'express'
import { hashPassword } from '../services/passwordService'

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const usuario = await prisma.findUnique({
            where: {
                id,
            }
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
        const existingUser = await prisma.findUnique({
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

        const updatedUser = await prisma.update({
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
        await prisma.delete({
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