import express from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  deleteProductoPermanente,
  uploadImagenPrincipal,
  uploadImagenesGaleria,
  eliminarImagen,
  eliminarImagenesMultiples
} from "../controllers/productoController.js";
import photoUpload from "../middleware/multer.js";

const router = express.Router();

// Rutas básicas de productos
router.get("/", getProductos);
router.get("/:id", getProductoById);
router.post("/", createProducto);
router.put("/:id", updateProducto);
// Desactivar producto
router.delete("/:id", deleteProducto);
// Eliminar producto permanentemente
router.delete("/:id/permanent", deleteProductoPermanente);

// ==========================================
// RUTAS PARA MANEJO DE IMÁGENES
// ==========================================

// Subir imagen principal (una sola imagen)
router.post("/upload/imagen-principal", photoUpload.single("imagen"), uploadImagenPrincipal);

// Subir múltiples imágenes para galería (hasta 10 imágenes)
router.post("/upload/galeria", photoUpload.array("imagenes", 10), uploadImagenesGaleria);

// Eliminar imagen específica por public_id
router.delete("/imagen/:public_id", eliminarImagen);

// Eliminar múltiples imágenes
router.delete("/imagenes/multiples", eliminarImagenesMultiples);

export default router; 