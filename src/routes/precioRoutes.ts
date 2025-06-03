import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken'
import { addDescuento, addDetalleProducto, createPrecio, deletePrecio, getAllPrecios, getEnabledPrecios, getPrecioById, listarPorDescuento, listarPorDetalleProducto, toggleHabilitado, updatePrecio } from '../controllers/precioController'

const router = express.Router()

//GET /precios
router.get('/', authenticateToken, getAllPrecios);

//GET /precios/getEnabledPrecios
router.get('/getEnabled',authenticateToken, getEnabledPrecios);

//GET /precios/:id
router.get('/:id', authenticateToken, getPrecioById);

//POST /precios
router.post('/', authenticateToken, createPrecio);

//PUT /precios
router.put('/', authenticateToken, updatePrecio);

//DELETE /precios/id:
router.delete('/:id', authenticateToken, deletePrecio);

//PATCH /precios/toggle-habilitado/:id
router.patch('/toggle-habilitado/:id', authenticateToken, toggleHabilitado);

//GET /detallesProductos/:id
router.get("/detallesProductos/:id", authenticateToken, listarPorDetalleProducto)

//GET /descuentos/:id
router.get("/descuentos/:id", authenticateToken, listarPorDescuento)

//POST /detallesProductos/:precioId
router.post("/detallesProductos/:precioId", authenticateToken, addDetalleProducto)

//POST /descuentos/:precioId
router.post("/descuentos/:precioId", authenticateToken, addDescuento)

export default router