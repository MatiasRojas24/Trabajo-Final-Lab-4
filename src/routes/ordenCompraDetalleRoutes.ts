import express, { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticateToken';
import { addDetalleProducto, addOrdenCompra, listarPorDetalleProducto, listarPorOrdenCompra } from '../controllers/ordenCompraDetalleController';

const router = express.Router();

//GET /ordenCompras/:id
router.get("/ordenCompras/:id", authenticateToken, listarPorOrdenCompra)

//GET /detallesProductos/:id
router.get("/detallesProductos/:id", authenticateToken, listarPorDetalleProducto)

//POST /ordenCompra/:ordenCompraDetalleId
router.post("/ordenCompras/:ordenComprasId",authenticateToken, addOrdenCompra)

//POST /detallesProductos/:ordenCompraDetalleId
router.post("//detallesProductos/:ordenCompraDetalleId",authenticateToken,addDetalleProducto)

export default router