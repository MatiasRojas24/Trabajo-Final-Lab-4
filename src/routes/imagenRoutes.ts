import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken'
import { addDetalleProductoToImagen, createImagen, deleteImagen, getEnabledImagenes, getImagenByDetalleProductoId, getImagenById, getImagenes, toggleEnableImagen, updateImagen } from '../controllers/imagenController'

const router = express.Router()

// GET /imagenes/getEnabled
router.get('/getEnabled', getEnabledImagenes)

// PATCH /imagenes/toggleEnabled/:id
router.patch('/toggleEnabled/:id', authenticateToken, toggleEnableImagen)

// POST /imagenes
router.post('', authenticateToken, createImagen)

// GET /imagenes
router.get('', authenticateToken, getImagenes)

// GET /imagenes/:id
router.get('/:id', authenticateToken, getImagenById)

// PUT /imagenes/:id
router.put('/:id', authenticateToken, updateImagen)

// DELETE /imagenes/:id
router.delete('/:id', authenticateToken, deleteImagen)

// POST /imagenes/:imgId/detalleProducto
router.post('/:imgId/detalleProducto', authenticateToken, addDetalleProductoToImagen)

// GET /imagenes/detalleProducto/:dpId
router.get('/detalleProducto/:dpId', authenticateToken, getImagenByDetalleProductoId)

export default router