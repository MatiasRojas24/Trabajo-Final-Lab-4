import express from 'express'
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController'

const router = express.Router()

// GET /usuarios
router.get('', getUsers)

// GET /usuarios/:id
router.get('/:id', getUserById)

// PUT /usuarios/:id
router.put('/:id', updateUser)

// DELETE /usuarios/:id
router.delete('/:id', deleteUser)

export default router;