import { Router } from "express";
import {
  getEnabledCatalogos,
  toggleEnabledCatalogo,
  getCatalogos,
  getCatalogoById,
  createCatalogo,
  updateCatalogo,
  deleteCatalogo,
} from "../controllers/catalogoController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

// GET /catalogos/getEnabled
router.get("/getEnabled", getEnabledCatalogos);

// PATCH /catalogos/toggle-habilitado/:id
router.patch(
  "/toggle-habilitado/:id",
  authenticateToken,
  toggleEnabledCatalogo
);

// GET /catalogos
router.get("/", authenticateToken, getCatalogos);

// GET /catalogos/:id
router.get("/:id", authenticateToken, getCatalogoById);

// POST /catalogos
router.post("/", authenticateToken, createCatalogo);

// PUT /catalogos/:id
router.put("/:id", authenticateToken, updateCatalogo);

// DELETE /catalogos/:id
router.delete("/:id", authenticateToken, deleteCatalogo);

export default router;
