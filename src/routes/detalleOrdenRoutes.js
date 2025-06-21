import express from 'express';
import {
  getDetalleOrdenes,
  getDetalleOrdenById,
  createDetalleOrden,
  updateDetalleOrden,
  deleteDetalleOrden
} from '../controllers/detalleOrdenController.js';

const router = express.Router();

router.post('/', createDetalleOrden);
router.get('/', getDetalleOrdenes);
router.get('/:id', getDetalleOrdenById);
router.put('/:id', updateDetalleOrden);
router.delete('/:id', deleteDetalleOrden);

export default router; 