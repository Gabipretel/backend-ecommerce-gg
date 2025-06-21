import express from "express";
import {
  getDireccionesByUsuario,
  getDireccionById,
  createDireccion,
  updateDireccion,
  deleteDireccion
} from "../controllers/direccionController.js";

const router = express.Router();
// /api/direcciones


// Obtener direcciones por usuario /api/direcciones/usuario/:userId
router.get("/usuario/:userId", getDireccionesByUsuario);
router.get("/:id", getDireccionById);
router.post("/", createDireccion);
router.put("/:id", updateDireccion);
router.delete("/:id", deleteDireccion);

export default router; 