import { Router } from "express";
import {
  getEnabledProductos,
  toggleEnabledProducto,
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  agregarCatalogo,
  listarPorCatalogo,
  filtrarProductos,
} from "../controllers/productoController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

// GET /productos/getEnabled
router.get("/getEnabled", getEnabledProductos);

// PATCH /productos/toggle-habilitado/:id
router.patch(
  "/toggle-habilitado/:id",
  authenticateToken,
  toggleEnabledProducto
);

// GET /productos
router.get("/", authenticateToken, getProductos);

// GET /productos/:id
router.get("/:id", authenticateToken, getProductoById);

// POST /productos
router.post("/", authenticateToken, createProducto);

// PUT /productos/:id
router.put("/:id", authenticateToken, updateProducto);

// DELETE /productos/:id
router.delete("/:id", authenticateToken, deleteProducto);

// POST /productos/catalogos/:idProducto
router.post("/catalogos/:idProducto", authenticateToken, agregarCatalogo);

// GET /productos/catalogos/:id
router.get("/catalogos/:id", authenticateToken, listarPorCatalogo);

// GET /productos/filtro
router.get("/filtro", authenticateToken, filtrarProductos);

export default router;
