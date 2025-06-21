import { Producto, Categoria, Marca, Administrador, Opinion, Usuario } from "../models/index.js";


export const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Marca, as: 'marca' },
      ]
    });

    res.status(200).json({
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Marca, as: 'marca' },
      ]
    });

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { 
      id_categoria, 
      id_marca, 
      id_administrador, 
      nombre, 
      descripcion, 
      sku, 
      precio, 
      stock, 
      imagen_url, 
      destacado 
    } = req.body;

    const nuevoProducto = await Producto.create({
      id_categoria,
      id_marca,
      id_administrador,
      nombre,
      descripcion,
      sku,
      precio,
      stock: stock || 0,
      imagen_url,
      destacado: destacado || false
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      data: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear producto',
      error: error.message
    });
  }
};


export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      id_categoria, 
      id_marca, 
      nombre, 
      descripcion, 
      sku, 
      precio, 
      stock, 
      imagen_url, 
      activo, 
      destacado 
    } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await producto.update({
      id_categoria: id_categoria || producto.id_categoria,
      id_marca: id_marca || producto.id_marca,
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      sku: sku || producto.sku,
      precio: precio || producto.precio,
      stock: stock !== undefined ? stock : producto.stock,
      imagen_url: imagen_url || producto.imagen_url,
      activo: activo !== undefined ? activo : producto.activo,
      destacado: destacado !== undefined ? destacado : producto.destacado
    });


    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};


export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await producto.update({ activo: false });

    res.status(200).json({
      message: 'Producto desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};


export const deleteProductoPermanente = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await producto.destroy();

    res.status(200).json({
      message: 'Producto eliminado permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
}; 