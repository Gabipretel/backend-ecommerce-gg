import express from 'express';
import {
  registerUser,
  registerAdmin,
  login,
  refreshToken,
} from '../controllers/authController.js';
import { verifyToken, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post('/register', registerUser);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Rutas para administradores (requieren ser superadmin)
router.post('/register-admin', verifyToken, requireSuperAdmin, registerAdmin);

export default router;
