import express from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  deleteProductoPermanente
} from "../controllers/productoController.js";

const router = express.Router();

router.get("/", getProductos);
router.get("/:id", getProductoById);
router.post("/", createProducto);
router.put("/:id", updateProducto);
// Desactivar producto
router.delete("/:id", deleteProducto);
// Eliminar producto permanentemente
router.delete("/:id/permanent", deleteProductoPermanente);

export default router; 