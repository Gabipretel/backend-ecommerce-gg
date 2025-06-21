import { Carrito, ItemCarrito, Usuario, Producto } from "../models/index.js";


export const getCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] }
      ]
    });

    res.status(200).json({
      data: carritos
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener carritos',
      error: error.message
    });
  }
};

export const getCarritoByUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const carrito = await Carrito.findOne({
      where: { id_usuario: userId },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] },
        {
          model: ItemCarrito,
          as: 'items',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });

    if (!carrito) {
      return res.status(404).json({
        message: 'Carrito no encontrado'
      });
    }

    res.status(200).json({
      data: carrito
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener carrito',
      error: error.message
    });
  }
};


export const addProductoToCarrito = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id_producto, cantidad = 1 } = req.body;
    
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }
    
    let carrito = await Carrito.findOne({
      where: { id_usuario: userId }
    });

    if (!carrito) {
      carrito = await Carrito.create({
        id_usuario: userId
      });
    }

    const itemExistente = await ItemCarrito.findOne({
      where: { 
        id_carrito: carrito.id,
        id_producto: id_producto
      }
    });

    if (itemExistente) {
      await itemExistente.update({
        cantidad: itemExistente.cantidad + cantidad
      });
    } else {
      await ItemCarrito.create({
        id_carrito: carrito.id,
        id_producto: id_producto,
        cantidad: cantidad,
        precio: producto.precio
      });
    }

    res.status(200).json({
      message: 'Producto agregado al carrito exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al agregar producto al carrito',
      error: error.message
    });
  }
};

export const updateItemCarrito = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { cantidad } = req.body;

    const item = await ItemCarrito.findOne({
      where: { id: itemId },
      include: [
        {
          model: Carrito,
          as: 'carrito',
          where: { id_usuario: userId }
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item no encontrado en el carrito'
      });
    }

    await item.update({ cantidad });

    res.status(200).json({
      message: 'Cantidad actualizada'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar item del carrito',
      error: error.message
    });
  }
};

export const removeProductoFromCarrito = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    const item = await ItemCarrito.findOne({
      where: { id: itemId },
      include: [
        {
          model: Carrito,
          as: 'carrito',
          where: { id_usuario: userId }
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item no encontrado en el carrito'
      });
    }

    await item.destroy();

    res.status(200).json({
      message: 'Producto removido del carrito'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al remover producto del carrito',
      error: error.message
    });
  }
};

export const clearCarrito = async (req, res) => {
  try {
    const { userId } = req.params;

    const carrito = await Carrito.findOne({
      where: { id_usuario: userId }
    });

    if (!carrito) {
      return res.status(404).json({
        message: 'Carrito no encontrado'
      });
    }

    await ItemCarrito.destroy({
      where: { id_carrito: carrito.id }
    });

    res.status(200).json({
      message: 'Carrito vaciado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al vaciar carrito',
      error: error.message
    });
  }
}; 