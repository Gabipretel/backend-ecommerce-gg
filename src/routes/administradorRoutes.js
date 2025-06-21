import express from "express";
import {
  getAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
  deleteAdministradorPermanente
} from "../controllers/administradorController.js";

const router = express.Router();

//  /api/administradores

router.get("/", getAdministradores);
router.get("/:id", getAdministradorById);
router.post("/", createAdministrador);
router.put("/:id", updateAdministrador);
// Borrado logico activo a false
router.delete("/:id", deleteAdministrador);
// Eliminar administrador permanentemente
router.delete("/:id/permanent", deleteAdministradorPermanente);

export default router; 