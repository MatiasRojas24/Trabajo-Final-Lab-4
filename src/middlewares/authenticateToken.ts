import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//Middleware de JWT para ver si estamos autenticados
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        res.status(401).json({ error: 'No autorizado' })
        return
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {
            console.error('Error en la autenticación: ', err)
            res.status(403).json({ error: 'No tienes acceso a este recurso' })
            return
        }

        next();

    })
}