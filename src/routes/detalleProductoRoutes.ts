import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken'
import { addProductoToDetalleProducto, addTalleToDetalleProducto, createDetalleProducto, deleteDetalleProducto, getDetalleProductoById, getDetalleProductoByProducto, getDetalleProductoByTalle, getDetallesProductos, getEnabledDetallesProductos, listarProductosFiltrados, toggleHabilitadoDetProd, updateDetalleProducto } from '../controllers/detalleProductoController'

const router = express.Router()

// GET /detalleProducto/getEnabled
router.get('/getEnabled', getEnabledDetallesProductos )

// PATCH /detalleProducto/toggleEnabled/:id
router.patch('/toggleEnabled/:id', toggleHabilitadoDetProd)

// POST /detalleProducto
router.post('', authenticateToken, createDetalleProducto)

// GET /detalleProducto
router.get('', authenticateToken, getDetallesProductos)

// GET /detalleProducto/:id
router.get('/:id', authenticateToken, getDetalleProductoById)

// PUT /detalleProducto/:id
router.put('/:id', authenticateToken, updateDetalleProducto) // no anda    // actu: si anda xD (nunca usen el 'as Prisma.' despues del 'data: {}')

// DELETE /detalleProducto/:id
router.delete('/:id', deleteDetalleProducto)

// POST /detalleProducto/:dpId/talle
router.post('/:dpId/talle', authenticateToken, addTalleToDetalleProducto) // No lo pude probar sin los talles

// GET /detalleProducto/:talleId
router.get('/:talleId', authenticateToken, getDetalleProductoByTalle) // No lo pude probar sin los talles

// POST /detalleProducto/:dpId/producto
router.post('/:dpId/producto', authenticateToken, addProductoToDetalleProducto) // No lo pude probar sin los productos

// GET /detalleProducto/:productoId
router.get('/:productoId', authenticateToken, getDetalleProductoByProducto) // No lo pude probar sin los productos

// GET /productos/filtrados
router.get('/filtrados', authenticateToken, listarProductosFiltrados) // PROBAR ESTE FILTRO MAS TARDE Y VER SI HAY QUE COLOCAR ESTE ROUTER MAS ARRIBA

export default router