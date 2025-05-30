import { Request, Response } from "express";
import { hashPassword } from "../services/passwordService";
import prisma from '../models/usuario'
import { generateToken } from "../services/authService";

export const registerCliente = async (req: Request, res: Response): Promise<void> => {
    const { email, password, nombre, dni } = req.body;

    try {
        const hashedPassword = await hashPassword(password)

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword,
                    nombre,
                    dni,
                    rol: 'CLIENTE'
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'hubo un error en el registro del cliente' })
    }
}
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password, nombre, dni } = req.body;

    try {
        const existingEmail = await prisma.usuario.findUnique({
            where: { email },
        });
        if (existingEmail) {
            res.status(400).json({ error: "El email ya está en uso." });
            return;
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword,
                    nombre,
                    dni,
                    rol: 'ADMIN'
                }
            }
        )
        const token = generateToken(user)
        res.status(201).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'hubo un error en el registro del administrador' })
    }
}