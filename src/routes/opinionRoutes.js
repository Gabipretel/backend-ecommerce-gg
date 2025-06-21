import express from "express";
import {
  getOpiniones,
  getOpinionesByProducto,
  createOpinion,
  updateOpinion,
  deleteOpinion
} from "../controllers/opinionController.js";

const router = express.Router();

router.get("/", getOpiniones);
router.get("/producto/:productId", getOpinionesByProducto);
router.post("/", createOpinion);
router.put("/:id", updateOpinion);
router.delete("/:id", deleteOpinion);

export default router; 