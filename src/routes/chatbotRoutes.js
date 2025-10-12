import express from "express";
import { procesarMensaje } from "../controllers/chatbotController.js";

const router = express.Router();

// POST /api/chatbot/mensaje - Procesar mensaje del usuario
router.post("/mensaje", procesarMensaje);

// GET /api/chatbot/health - Para verificar si el servicio está funcionando
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chatbot service is running",
    timestamp: new Date().toISOString(),
    status: "active",
  });
});

export default router;
