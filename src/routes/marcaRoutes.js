import express from "express";
import {
  getMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
  deleteMarcaPermanente
} from "../controllers/marcaController.js";

const router = express.Router();

// /api/marcas

router.get("/", getMarcas);
router.get("/:id", getMarcaById);
router.post("/", createMarca);
router.put("/:id", updateMarca);
// Desactivar marca
router.delete("/:id", deleteMarca);
// Eliminar marca permanentemente
router.delete("/:id/permanent", deleteMarcaPermanente);

export default router; 