import express from 'express'
import { registerAdmin, registerCliente } from '../controllers/authController'

const router = express.Router()

router.post('/registerCliente', registerCliente)
router.post('/registerAdmin', registerAdmin)
router.post('/login')

export default router;