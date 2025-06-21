import { Categoria, Administrador, Producto } from "../models/index.js";

export const getCategorias = async (req, res) => {
  try {

    const categorias = await Categoria.findAll({
      order: [['nombre', 'ASC']]
    });
    if(categorias.length === 0){
      return res.status(404).json({
        message: 'No hay categorias cargadas'
      });
    }
    res.status(200).json({
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};


export const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      data: categoria
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};


export const createCategoria = async (req, res) => {
  try {
    const { id_administrador, nombre, descripcion } = req.body;
    
    const administrador = await Administrador.findByPk(id_administrador);
    if (!administrador) {
      return res.status(400).json({
        message: 'Administrador no válido'
      });
    }

    const nuevaCategoria = await Categoria.create({
      id_administrador,
      nombre,
      descripcion
    });

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    await categoria.update({
      nombre: nombre || categoria.nombre,
      descripcion: descripcion || categoria.descripcion,
      activo: activo !== undefined ? activo : categoria.activo
    });

    res.status(200).json({
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};


export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      });
    }

    await categoria.update({ activo: false });

    res.status(200).json({
      message: 'Categoría desactivada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
}; 