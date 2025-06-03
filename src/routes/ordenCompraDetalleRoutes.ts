import express, { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticateToken';
import { addDetalleProducto, addOrdenCompra, createOrdenCompraDetalle, deleteOrdenCompraDetalle, getEnabledOrdenComprasDetalle, getOrdenCompraDetalleById, getOrdenesCompraDetalle, listarPorDetalleProducto, listarPorOrdenCompra, toggleHabilitadoOrdenCompraDetalle, updateOrdenCompraDetalle } from '../controllers/ordenCompraDetalleController';

const router = express.Router();

//GET /ordenComprasDetalle
router.get("/", authenticateToken, getOrdenesCompraDetalle);

//GET /ordenComprasDetalle/getEnabledOrdenComprasDetalle
router.get("/getEnabled", authenticateToken, getEnabledOrdenComprasDetalle);

//GET /ordenComprasDetalle/:id
router.get("/:id", authenticateToken, getOrdenCompraDetalleById);

//POST /ordenComprasDetalle
router.post("/", authenticateToken, createOrdenCompraDetalle);

//PUT /ordenComprasDetalle/:id
router.put("/:id", authenticateToken, updateOrdenCompraDetalle);

//PATCH /ordenComprasDetalle/toggle-habilitado/:id
router.patch("/toggle-habilitado/:id", authenticateToken, toggleHabilitadoOrdenCompraDetalle);


//DELETE /ordenComprasDetalle/:id
router.delete("/:id", authenticateToken, deleteOrdenCompraDetalle);

//GET /ordenCompras/:id
router.get("/ordenCompras/:id", authenticateToken, listarPorOrdenCompra)

//GET /detallesProductos/:id
router.get("/detallesProductos/:id", authenticateToken, listarPorDetalleProducto)

//POST /ordenCompra/:ordenCompraDetalleId
router.post("/ordenCompras/:ordenComprasId", authenticateToken, addOrdenCompra)

//POST /detallesProductos/:ordenCompraDetalleId
router.post("/detallesProductos/:ordenCompraDetalleId", authenticateToken, addDetalleProducto)

export default router