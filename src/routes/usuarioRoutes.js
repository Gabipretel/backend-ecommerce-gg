import express from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  deleteUsuarioPermanente
} from "../controllers/usuarioController.js";

const router = express.Router();
// /api/usuarios

router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
// Desactivar usuario 
router.delete("/:id", deleteUsuario);
// Eliminar usuario permanentemente
router.delete("/permanent/:id", deleteUsuarioPermanente);

export default router; 