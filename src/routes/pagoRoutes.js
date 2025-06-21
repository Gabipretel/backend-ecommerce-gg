import express from "express";
import {
  getPagos,
  getPagosByOrden,
  getPagoById,
  createPago,
  updatePago,
} from "../controllers/pagoController.js";

const router = express.Router();

router.get("/", getPagos);

// IMPORTANTE: Rutas específicas ANTES que genéricas
// GET /api/pagos/orden/:ordenId - Obtener pagos por orden
router.get("/orden/:ordenId", getPagosByOrden);

// GET /api/pagos/:id - Obtener pago por ID (DEBE IR AL FINAL)
router.get("/:id", getPagoById);

router.post("/", createPago);

// PUT /api/pagos/:id - Actualizar pago
router.put("/:id", updatePago);


export default router; 