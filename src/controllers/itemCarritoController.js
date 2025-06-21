import { ItemCarrito, Carrito, Producto, Usuario } from "../models/index.js";

export const getItemsCarrito = async (req, res) => {
  try {
    const items = await ItemCarrito.findAll({
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      data: items
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener items de carrito',
      error: error.message
    });
  }
};

export const getItemsByUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const items = await ItemCarrito.findAll({
      include: [
        { 
          model: Carrito, 
          as: 'carrito',
          where: { id_usuario: userId }
        }
      ],
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      data: items
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener items del carrito del usuario',
      error: error.message
    });
  }
};

export const getItemCarritoById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItemCarrito.findByPk(id, {
      include: [
        { 
          model: Carrito, 
          as: 'carrito',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] }
          ]
        },
        { model: Producto, as: 'producto' }
      ]
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item de carrito no encontrado'
      });
    }

    res.status(200).json({
      data: item
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener item de carrito',
      error: error.message
    });
  }
};

export const createItemCarrito = async (req, res) => {
  try {
    const { 
      id_carrito, 
      id_producto, 
      cantidad
    } = req.body;

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    const nuevoItem = await ItemCarrito.create({
      id_carrito,
      id_producto,
      cantidad,
      precio: producto.precio
    });
    
    res.status(201).json({
      message: 'Item agregado al carrito exitosamente',
      data: nuevoItem
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear item de carrito',
      error: error.message
    });
  }
};

export const updateItemCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const item = await ItemCarrito.findByPk(id, {
      include: [{ model: Producto, as: 'producto' }]
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item de carrito no encontrado'
      });
    }
    await item.update({ cantidad });

    const itemActualizado = await ItemCarrito.findByPk(id, {
      include: [
        { model: Carrito, as: 'carrito' },
        { model: Producto, as: 'producto' }
      ]
    });
    
    res.status(200).json({
      message: 'Item de carrito actualizado exitosamente',
      data: itemActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar item de carrito',
      error: error.message
    });
  }
};

export const deleteItemCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ItemCarrito.findByPk(id);

    if (!item) {
      return res.status(404).json({
        message: 'Item de carrito no encontrado'
      });
    }

    await item.destroy();

    res.status(200).json({
      message: 'Item eliminado del carrito exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar item de carrito',
      error: error.message
    });
  }
};
