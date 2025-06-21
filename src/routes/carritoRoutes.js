import express from "express";
import {
  getCarritos,
  getCarritoByUsuario,
  addProductoToCarrito,
  updateItemCarrito,
  removeProductoFromCarrito,
  clearCarrito
} from "../controllers/carritoController.js";

const router = express.Router();
// /api/carrito

router.get("/", getCarritos);
router.get("/usuario/:userId", getCarritoByUsuario);
router.post("/usuario/:userId/add", addProductoToCarrito);
// Actualizar cantidad de item /api/carrito/usuario/:userId/item/:itemId
router.put("/usuario/:userId/item/:itemId", updateItemCarrito);
router.delete("/usuario/:userId/item/:itemId", removeProductoFromCarrito);
router.delete("/usuario/:userId/clear", clearCarrito);

export default router; 