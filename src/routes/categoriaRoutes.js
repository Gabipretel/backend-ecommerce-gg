import express from "express";
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from "../controllers/categoriaController.js";

const router = express.Router();
// /api/categorias

router.get("/", getCategorias);
router.get("/:id", getCategoriaById);
router.post("/", createCategoria);
router.put("/:id", updateCategoria);
// Desactivar categoría
router.delete("/:id", deleteCategoria);

export default router; 