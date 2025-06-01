import express from "express"
import { authenticateToken } from "../middlewares/authenticateToken";
import { createDescuento, deleteDescuento, getAllDescuentos, getDescuentoById, getHabilitados, toggleHabilitadoDescuento, updateDescuentos } from "../controllers/descuentosController";

const router = express.Router();

// GET /descuentos/getEnabled
router.get('/getEnabled', getHabilitados )

// PATCH /descuentos/:id
router.patch('/:id', authenticateToken, toggleHabilitadoDescuento)

// POST /descuentos
router.post('', authenticateToken, createDescuento)

// GET /descuentos
router.get('', authenticateToken, getAllDescuentos)

// GET /descuentos/:id
router.get('/:id', authenticateToken, getDescuentoById)

// UPDATE /descuentos/:id
router.put('/:id', authenticateToken, updateDescuentos)

// DELETE /descuentos/:id
router.delete('/:id', authenticateToken, deleteDescuento)

export default router