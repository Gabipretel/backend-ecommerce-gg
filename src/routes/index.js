import express from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import productoRoutes from "./productoRoutes.js";
import carritoRoutes from "./carritoRoutes.js";
import categoriaRoutes from "./categoriaRoutes.js";
import administradorRoutes from "./administradorRoutes.js";
import marcaRoutes from "./marcaRoutes.js";
import direccionRoutes from "./direccionRoutes.js";
import ordenRoutes from "./ordenRoutes.js";
import pagoRoutes from "./pagoRoutes.js";
import opinionRoutes from "./opinionRoutes.js";
import detalleOrdenRoutes from "./detalleOrdenRoutes.js";
import itemCarritoRoutes from "./itemCarritoRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/productos", productoRoutes);
router.use("/carrito", carritoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/administradores", administradorRoutes);
router.use("/marcas", marcaRoutes);
router.use("/direcciones", direccionRoutes);
router.use("/ordenes", ordenRoutes);
router.use("/pagos", pagoRoutes);
router.use("/opiniones", opinionRoutes);
router.use("/detalle-ordenes", detalleOrdenRoutes);
router.use("/items-carrito", itemCarritoRoutes);

export default router; 