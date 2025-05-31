import express from 'express'
import { login, registerAdmin, registerCliente } from '../controllers/authController'

const router = express.Router()

router.post('/registerCliente', registerCliente)
router.post('/registerAdmin', registerAdmin)
router.post('/login', login)

export default router;