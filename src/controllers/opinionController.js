import { Opinion, Usuario, Producto } from "../models/index.js";
import sequelize from "../db/connection.js";

export const getOpiniones = async (req, res) => {
  try {
    const opiniones = await Opinion.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] },
        { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'imagen_url'] }
      ],
      order: [['fecha_opinion', 'DESC']]
    });

    res.status(200).json({
      data: opiniones
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener opiniones',
      error: error.message
    });
  }
};

export const getOpinionesByProducto = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const opiniones = await Opinion.findAll({
      where: { id_producto: productId },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] }
      ],
      order: [['fecha_opinion', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: opiniones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener opiniones del producto',
      error: error.message
    });
  }
};

export const createOpinion = async (req, res) => {
  try {
    const { 
      id_producto, 
      id_usuario, 
      calificacion, 
      titulo, 
      comentario 
    } = req.body;

    const nuevaOpinion = await Opinion.create({
      id_producto,
      id_usuario,
      calificacion,
      titulo,
      comentario
    });
    
    res.status(201).json({
      message: 'Opinión creada exitosamente',
      data: nuevaOpinion
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear opinión',
      error: error.message
    });
  }
};

export const updateOpinion = async (req, res) => {
  try {
    const { id } = req.params;
    const { calificacion, titulo, comentario } = req.body;

    const opinion = await Opinion.findByPk(id);
    if (!opinion) {
      return res.status(404).json({
        message: 'Opinión no encontrada'
      });
    }

    await opinion.update({
      calificacion: calificacion || opinion.calificacion,
      titulo: titulo || opinion.titulo,
      comentario: comentario || opinion.comentario
    });

    
    res.status(200).json({
      message: 'Opinión actualizada exitosamente',
      data: opinion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar opinión',
      error: error.message
    });
  }
};

export const deleteOpinion = async (req, res) => {
  try {
    const { id } = req.params;

    const opinion = await Opinion.findByPk(id);
    if (!opinion) {
      return res.status(404).json({
        message: 'Opinión no encontrada'
      });
    }

    await opinion.destroy();

    res.status(200).json({
      message: 'Opinión eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar opinión',
      error: error.message
    });
  }
}; 