import { DetalleOrden, Orden, Producto, Usuario } from "../models/index.js";


export const getDetalleOrdenes = async (req, res) => {
  try {
    const detalles = await DetalleOrden.findAll({
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      data: detalles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener detalles de órdenes',
      error: error.message
    });
  }
};

export const getDetalleOrdenById = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await DetalleOrden.findByPk(id, {
      include: [
        { 
          model: Orden, 
          as: 'orden',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] }
          ]
        },
        { model: Producto, as: 'producto' }
      ]
    });

    if (!detalle) {
      return res.status(404).json({
        success: false,
        message: 'Detalle de orden no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: detalle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalle de orden',
      error: error.message
    });
  }
};

export const createDetalleOrden = async (req, res) => {
  try {
    const { 
      id_orden, 
      id_producto, 
      cantidad, 
      precio_unitario 
    } = req.body;
    
    const orden = await Orden.findByPk(id_orden);
    const producto = await Producto.findByPk(id_producto);
    
    if (!orden || !producto) {
      return res.status(400).json({
        message: 'Orden o producto no válidos'
      });
    }

    const subtotal = parseFloat(precio_unitario || producto.precio) * cantidad;

    const nuevoDetalle = await DetalleOrden.create({
      id_orden,
      id_producto,
      cantidad,
      precio_unitario: precio_unitario || producto.precio,
      subtotal
    });


    const todosLosDetalles = await DetalleOrden.findAll({
      where: { id_orden }
    });

    const nuevoSubtotal = todosLosDetalles.reduce((sum, det) => sum + parseFloat(det.subtotal), 0);
    await orden.update({
      subtotal: nuevoSubtotal,
      total: nuevoSubtotal 
    });

    const detalleCompleto = await DetalleOrden.findByPk(nuevoDetalle.id, {
      include: [
        { model: Orden, as: 'orden' },
        { model: Producto, as: 'producto' }
      ]
    });
    
    res.status(201).json({
      message: 'Detalle de orden creado exitosamente',
      data: detalleCompleto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear detalle de orden',
      error: error.message
    });
  }
};

export const updateDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, precio_unitario } = req.body;

    const detalle = await DetalleOrden.findByPk(id, {
      include: [{ model: Orden, as: 'orden' }]
    });

    if (!detalle) {
      return res.status(404).json({
        message: 'Detalle de orden no encontrado'
      });
    }

    // Verificar que la orden permita modificaciones
    if (detalle.orden.estado === 'entregado' || detalle.orden.estado === 'cancelado') {
      return res.status(400).json({
        message: 'No se pueden modificar detalles de una orden entregada o cancelada'
      });
    }

    const nuevaCantidad = cantidad || detalle.cantidad;
    const nuevoPrecio = precio_unitario || detalle.precio_unitario;
    const nuevoSubtotal = nuevaCantidad * nuevoPrecio;

    await detalle.update({
      cantidad: nuevaCantidad,
      precio_unitario: nuevoPrecio,
      subtotal: nuevoSubtotal
    });

    // Actualizar totales de la orden
    const todosLosDetalles = await DetalleOrden.findAll({
      where: { id_orden: detalle.id_orden }
    });

    const nuevoSubtotalOrden = todosLosDetalles.reduce((sum, det) => sum + parseFloat(det.subtotal), 0);
    await Orden.update(
      {
        subtotal: nuevoSubtotalOrden,
        total: nuevoSubtotalOrden
      },
      { where: { id: detalle.id_orden } }
    );

    const detalleActualizado = await DetalleOrden.findByPk(id, {
      include: [
        { model: Orden, as: 'orden' },
        { model: Producto, as: 'producto' }
      ]
    });
    
    res.status(200).json({
      message: 'Detalle de orden actualizado exitosamente',
      data: detalleActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar detalle de orden',
      error: error.message
    });
  }
};

export const deleteDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetalleOrden.findByPk(id, {
      include: [{ model: Orden, as: 'orden' }]
    });

    if (!detalle) {
      return res.status(404).json({
        message: 'Detalle de orden no encontrado'
      });
    }

    await detalle.destroy();

    const detallesRestantes = await DetalleOrden.findAll({
      where: { id_orden: detalle.id_orden }
    });

    const nuevoSubtotal = detallesRestantes.reduce((sum, det) => sum + parseFloat(det.subtotal), 0);
    await Orden.update(
      {
        subtotal: nuevoSubtotal,
        total: nuevoSubtotal
      },
      { where: { id: detalle.id_orden } }
    );

    res.status(200).json({
      message: 'Detalle de orden eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar detalle de orden',
      error: error.message
    });
  }
}; 