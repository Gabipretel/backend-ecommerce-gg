import { Pago, Orden, Usuario } from "../models/index.js";


export const getPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      order: [['fecha_pago', 'DESC']]
    });

    res.status(200).json({
      data: pagos
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pagos',
      error: error.message
    });
  }
};

export const getPagosByOrden = async (req, res) => {
  try {
    const { ordenId } = req.params;
    
    const pagos = await Pago.findAll({
      where: { id_orden: ordenId },
      include: [
        { 
          model: Orden, 
          as: 'orden',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] }
          ]
        }
      ],
      order: [['fecha_pago', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: pagos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos de la orden',
      error: error.message
    });
  }
};


export const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id, {
      include: [
        { 
          model: Orden, 
          as: 'orden',
          include: [
            { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido', 'email'] }
          ]
        }
      ]
    });

    if (!pago) {
      return res.status(404).json({
        message: 'Pago no encontrado'
      });
    }

    res.status(200).json({
      data: pago
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pago',
      error: error.message
    });
  }
};


export const createPago = async (req, res) => {
  try {
    const { 
      id_orden, 
      metodo_pago, 
      id_transaccion, 
      monto 
    } = req.body;
    
    const orden = await Orden.findByPk(id_orden);
    if (!orden) {
      return res.status(400).json({
        message: 'Orden no válida'
      });
    }

    const nuevoPago = await Pago.create({
      id_orden,
      metodo_pago,
      id_transaccion,
      monto,
      estado: 'pendiente'
    });

    const pagoCompleto = await Pago.findByPk(nuevoPago.id, {
      include: [
        { model: Orden, as: 'orden' }
      ]
    });
    
    res.status(201).json({
      message: 'Pago creado exitosamente',
      data: pagoCompleto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear pago',
      error: error.message
    });
  }
};


export const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, id_transaccion } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({
        message: 'Pago no encontrado'
      });
    }

    await pago.update({
      estado: estado || pago.estado,
      id_transaccion: id_transaccion || pago.id_transaccion
    });

    const pagoActualizado = await Pago.findByPk(id, {
      include: [
        { model: Orden, as: 'orden' }
      ]
    });
    
    res.status(200).json({
      message: 'Pago actualizado exitosamente',
      data: pagoActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar pago',
      error: error.message
    });
  }
};
