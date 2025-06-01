import { Router } from "express";
import {
  getEnabledTalles,
  toggleEnabledTalle,
  getTalles,
  getTalleById,
  createTalle,
  updateTalle,
  deleteTalle,
} from "../controllers/talleController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

// GET /talles/getEnabled
router.get("/getEnabled", getEnabledTalles);

// PATCH /talles/toggle-habilitado/:id
router.patch("/toggle-habilitado/:id", authenticateToken, toggleEnabledTalle);

// GET /talles
router.get("/", authenticateToken, getTalles);

// GET /talles/:id
router.get("/:id", authenticateToken, getTalleById);

// POST /talles
router.post("/", authenticateToken, createTalle);

// PUT /talles/:id
router.put("/:id", authenticateToken, updateTalle);

// DELETE /talles/:id
router.delete("/:id", authenticateToken, deleteTalle);

export default router;
