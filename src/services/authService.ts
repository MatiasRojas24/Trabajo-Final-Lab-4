import jwt from 'jsonwebtoken'
import { UserCredentials } from '../models/user.interface'

const JWT_SECRET = process.env.JWT_SECRET || 'Default-secret'

export const generateToken = (user: UserCredentials): string => {
    return jwt.sign({ id: user.id, email: user.email, password: user.password }, JWT_SECRET, { expiresIn: '1h' })
}