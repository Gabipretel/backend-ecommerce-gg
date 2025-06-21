import express from "express";
import {
  getOrdenes,
  getOrdenesByUsuario,
  createOrden,
  updateOrden,
  deleteOrden
} from "../controllers/ordenController.js";

const router = express.Router();

router.get("/", getOrdenes);
router.post("/", createOrden);
router.get("/usuario/:userId", getOrdenesByUsuario);
router.put("/:id", updateOrden);
router.delete("/:id", deleteOrden);

export default router; 