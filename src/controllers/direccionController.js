import { Direccion, Usuario } from "../models/index.js";

export const getDireccionesByUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        message: 'Se requiere un ID de usuario válido'
      });
    }

    const usuario = await Usuario.findByPk(parseInt(userId));
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }
    
    const direcciones = await Direccion.findAll({
      where: { 
        id_usuario: parseInt(userId)
      },
      attributes: ['id', 'calle', 'numero', 'localidad', 'provincia', 'codigo_postal', 'es_principal'],
      order: [['es_principal', 'DESC'], ['id', 'DESC']]
    });

    if (!direcciones || direcciones.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron direcciones para este usuario'
      });
    }

    res.status(200).json({
      data: direcciones
    });
  } catch (error) {
    console.log('Error en getDireccionesByUsuario:', error);
    res.status(500).json({
      message: 'Error al obtener direcciones del usuario',
      error: error.message
    });
  }
};

export const getDireccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const direccion = await Direccion.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'apellido'] },
      ]
    });

    if (!direccion) {
      return res.status(404).json({
        message: 'Dirección no encontrada'
      });
    }

    res.status(200).json({
      data: direccion
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener dirección',
      error: error.message
    });
  }
};

export const createDireccion = async (req, res) => {
  try {
    const { 
      id_usuario, 
      calle, 
      numero, 
      localidad, 
      provincia, 
      codigo_postal, 
      es_principal 
    } = req.body;
    
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(400).json({
        message: 'Usuario no válido'
      });
    }

    const nuevaDireccion = await Direccion.create({
      id_usuario,
      calle,
      numero,
      localidad,
      provincia,
      codigo_postal,
      es_principal: es_principal || false
    });

    res.status(201).json({
      message: 'Dirección creada exitosamente',
      data: nuevaDireccion
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear dirección',
      error: error.message
    });
  }
};

export const updateDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      calle, 
      numero, 
      localidad, 
      provincia, 
      codigo_postal, 
      es_principal 
    } = req.body;

    const direccion = await Direccion.findByPk(id);
    if (!direccion) {
      return res.status(404).json({
        message: 'Dirección no encontrada'
      });
    }

    await direccion.update({
      calle: calle || direccion.calle,
      numero: numero || direccion.numero,
      localidad: localidad || direccion.localidad,
      provincia: provincia || direccion.provincia,
      codigo_postal: codigo_postal || direccion.codigo_postal,
      es_principal: es_principal !== undefined ? es_principal : direccion.es_principal
    });

    res.status(200).json({
      message: 'Dirección actualizada exitosamente',
      data: direccion
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar dirección',
      error: error.message
    });
  }
};

export const deleteDireccion = async (req, res) => {
  try {
    const { id } = req.params;

    const direccion = await Direccion.findByPk(id);
    if (!direccion) {
      return res.status(404).json({
        message: 'Dirección no encontrada'
      });
    }

    await direccion.destroy();

    res.status(200).json({
      message: 'Dirección eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar dirección',
      error: error.message
    });
  }
}; 