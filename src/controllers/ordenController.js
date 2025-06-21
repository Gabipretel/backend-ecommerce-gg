import { Orden, Usuario, Direccion, DetalleOrden, Producto, Pago } from "../models/index.js";

export const getOrdenes = async (req, res) => {
  try {    
    const ordenes = await Orden.findAll({
      order: [['fecha_orden', 'DESC']]
    });

    res.status(200).json({
      data: ordenes
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener órdenes',
      error: error.message
    });
  }
};

export const getOrdenesByUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const where = { id_usuario: userId };
    
    const ordenes = await Orden.findAll({
      where,
      order: [['fecha_orden', 'DESC']]
    });

    res.status(200).json({
      data: ordenes
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener órdenes del usuario',
      error: error.message
    });
  }
};

export const createOrden = async (req, res) => {
  try {
    const { 
      id_usuario, 
      id_direccion_envio, 
      subtotal,
      total
    } = req.body;
    
    const usuario = await Usuario.findByPk(id_usuario);
    const direccion = await Direccion.findByPk(id_direccion_envio);
    
    if (!usuario || !direccion) {
      return res.status(400).json({
        message: 'Usuario o dirección no válidos'
      });
    }

    // Generar número de orden único
    const numeroOrden = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const nuevaOrden = await Orden.create({
      id_usuario,
      id_direccion_envio,
      numero_orden: numeroOrden,
      subtotal: subtotal || 0,
      total: total || subtotal || 0
    });


    const ordenCompleta = await Orden.findByPk(nuevaOrden.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] },
        { model: Direccion, as: 'direccionEnvio' }
      ]
    });
    
    res.status(201).json({
      message: 'Orden creada exitosamente',
      data: ordenCompleta
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear orden',
      error: error.message
    });
  }
};

export const updateOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).json({
        message: 'Orden no encontrada'
      });
    }

    await orden.update({
      estado: estado || orden.estado
    });

    const ordenActualizada = await Orden.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] },
        { model: Direccion, as: 'direccionEnvio' },
        { 
          model: DetalleOrden, 
          as: 'detalles',
          include: [
            { model: Producto, as: 'producto' }
          ]
        }
      ]
    });
    
    res.status(200).json({
      message: 'Orden actualizada exitosamente',
      data: ordenActualizada
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar orden',
      error: error.message
    });
  }
};


export const deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await Orden.findByPk(id);
    
    if (!orden) {
      return res.status(404).json({
        message: 'Orden no encontrada'
      });
    }

    await orden.destroy();

    res.status(200).json({
      message: 'Orden eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar orden',
      error: error.message
    });
  }
}; 