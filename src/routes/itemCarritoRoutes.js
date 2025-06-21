import express from 'express';
import {
  getItemsCarrito,
  getItemsByUsuario,
  getItemCarritoById,
  createItemCarrito,
  updateItemCarrito,
  deleteItemCarrito
} from '../controllers/itemCarritoController.js';

const router = express.Router();


router.get('/', getItemsCarrito);
router.get('/usuario/:userId', getItemsByUsuario);
router.get('/:id', getItemCarritoById);
router.post('/', createItemCarrito);
router.put('/:id', updateItemCarrito);
router.delete('/:id', deleteItemCarrito);

export default router; 