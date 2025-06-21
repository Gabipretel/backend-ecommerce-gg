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
router.post("/", createPago);

router.get("/orden/:ordenId", getPagosByOrden);
router.get("/:id", getPagoById);
router.put("/:id", updatePago);


export default router; 