import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  addUsuariosToDireccion,
  createDireccion,
  deleteDireccion,
  getDireccionById,
  getDirecciones,
  getDireccionesByUserId,
  getEnabledDirecciones,
  toggleEnabled,
  updatedDireccion,
} from "../controllers/direccionController";

const router = express.Router();

// GET /direcciones/getEnabled
router.get("/getEnabled", authenticateToken, getEnabledDirecciones);

// PATCH /direcciones/toggleEnabled/:id
router.patch("/toggleEnabled/:id", authenticateToken, toggleEnabled);

// GET /direcciones
router.get("", authenticateToken, getDirecciones);

// GET /direcciones/:id
router.get("/:id", authenticateToken, getDireccionById);

// POST /direcciones
router.post("", authenticateToken, createDireccion);

// PUT /direcciones/:id
router.put("/:id", authenticateToken, updatedDireccion);

// DELETE /direcciones/:id
router.delete("/:id", authenticateToken, deleteDireccion);

// POST /direcciones/:direccionId/usuarios
router.post(
  "/:direccionId/usuarios",
  authenticateToken,
  addUsuariosToDireccion
);

// GET /direcciones/usuario/:usuarioId
router.get("/usuario/:usuarioId", authenticateToken, getDireccionesByUserId);

export default router;
