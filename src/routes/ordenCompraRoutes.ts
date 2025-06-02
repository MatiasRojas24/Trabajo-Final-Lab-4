import express from 'express'
import { authenticateToken } from '../middlewares/authenticateToken'
import { addDireccionOrdenCompra, addUserOrdenCompra, createOrdenCompra, deleteOrdenCompra, getEnabledOrdenDeCompra, getOrdenCompraById, getOrdenesCompra, listarPorDirecciones, listarPorUsuario, toggleHabilitadoOrdenCompra, updateOrdenCompra } from '../controllers/ordenCompraController'

const router = express.Router()
//GET /ordenesDeCompra
router.get("/", authenticateToken, getOrdenesCompra);

//GET /ordenesDeCompra/:id
router.get("/:id", authenticateToken, getOrdenCompraById);

//POST /ordenesDeCompra
router.post("/", authenticateToken, createOrdenCompra);

//PUT /ordenesDeCompra/:id
router.put("/:id", authenticateToken, updateOrdenCompra);

//DELETE /ordenesDeCompra/:id
router.delete("/:id", authenticateToken, deleteOrdenCompra);

//PATCH /ordenesDeCompra/toggle-habilitado/:id
router.patch("/toggle-habilitado/:id", authenticateToken, toggleHabilitadoOrdenCompra);

//GET /ordenesDeCompra/getEnabledOrdenesDeCompra
router.get("/getEnabledOrdenDeCompra", authenticateToken, getEnabledOrdenDeCompra)

//GET /ordenesDeCompra/usuarios/:id
router.get('/usuarios/:id', authenticateToken, listarPorUsuario)

//GET /direcciones/:id
router.get("/direcciones/:id", authenticateToken, listarPorDirecciones)

//POST /usuarios/:ordenCompraId
router.post("/usuarios/:ordenCompraId", authenticateToken,addUserOrdenCompra)

//POST /direcciones/idOrdenComrpraId
router.post("/direcciones/:ordenCompraId",authenticateToken, addDireccionOrdenCompra)


export default router
