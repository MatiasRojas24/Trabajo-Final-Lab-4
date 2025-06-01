import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken'
import { addDireccionOrdenCompra, addUserOrdenCompra, listarPorDirecciones, listarPorUsuario } from '../controllers/ordenCompraController'

const router = express.Router()

//GET /ordenesDeCompra/usuarios/:id
router.get('/usuarios/:id', authenticateToken, listarPorUsuario)
//GET /direcciones/:id
router.get("/direcciones/:id", authenticateToken, listarPorDirecciones)
//POST /usuarios/:ordenCompraId
router.post("/usuarios/:ordenCompraId", authenticateToken,addUserOrdenCompra)
//POST /direcciones/idOrdenComrpraId
router.post("/direcciones/:ordenCompraId",authenticateToken, addDireccionOrdenCompra)

export default router
