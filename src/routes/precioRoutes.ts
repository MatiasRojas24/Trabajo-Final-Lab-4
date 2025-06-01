import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken'
import { addDescuento, addDetalleProducto, listarPorDescuento, listarPorDetalleProducto } from '../controllers/precioController'

const router = express.Router()

//GET /detallesProductos/:id
router.get("/detallesProductos/:id",authenticateToken, listarPorDetalleProducto)

//GET /descuentos/:id
router.get("/descuentos/:id",authenticateToken, listarPorDescuento)

//POST /detallesProductos/:precioId
router.post("/detallesProductos/:precioId",authenticateToken,addDetalleProducto)

//POST /descuentos/:precioId
router.post("/descuentos/:precioId",authenticateToken, addDescuento)

export default router