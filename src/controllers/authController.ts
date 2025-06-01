import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/passwordService";
import { prismaUsuario } from '../models/usuario'
import { generateToken } from "../services/authService";


export const registerCliente = async (req: Request, res: Response): Promise<void> => {
    const { email, password, nombre, dni } = req.body;

    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' })
            return
        }
        if (!dni) {
            res.status(400).json({ message: 'El dni es obligatorio' })
            return
        }
        const hashedPassword = await hashPassword(password)

        const user = await prismaUsuario.create(
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
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' })
        }
        res.status(500).json({ error: 'hubo un error en el registro del cliente' })
    }
}
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password, nombre, dni } = req.body;

    try {
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' })
            return
        }
        if (!dni) {
            res.status(400).json({ message: 'El dni es obligatorio' })
            return
        }

        const hashedPassword = await hashPassword(password)

        const user = await prismaUsuario.create(
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
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' })
        }
        res.status(500).json({ error: 'hubo un error en el registro del cliente' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }

        const user = await prismaUsuario.findUnique({ where: { email } })
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseñas no coinciden' })
        }

        const token = generateToken(user)
        res.status(200).json({ token })


    } catch (error: any) {
        console.log('Error: ', error)
    }

}