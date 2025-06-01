import express from 'express'
import { getUsers, getUserById, updateUser, deleteUser, getEnabledUsers, toggleEnabled, addDireccionesToUser, getUsersByDireccionId } from '../controllers/userController'
import { authenticateToken } from '../middlewares/authenticateToken'

const router = express.Router()

// GET /usuarios/getEnabled
router.get('/getEnabled', authenticateToken, getEnabledUsers)

// PATCH /usuarios/toggleEnabled/:id
router.patch('/toggleEnabled/:id', authenticateToken, toggleEnabled)

// GET /usuarios
router.get('', authenticateToken, getUsers)

// GET /usuarios/:id
router.get('/:id', authenticateToken, getUserById)

// PUT /usuarios/:id
router.put('/:id', authenticateToken, updateUser)

// DELETE /usuarios/:id
router.delete('/:id', authenticateToken, deleteUser)

// POST /usuarios/:userId/direcciones
router.post('/:userId/direcciones', authenticateToken, addDireccionesToUser)

// GET /usuarios/direccion/:direccionId
router.get('/direccion/:direccionId', authenticateToken, getUsersByDireccionId)

export default router;