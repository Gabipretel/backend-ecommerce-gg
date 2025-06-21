import { Administrador } from "../models/index.js";


export const getAdministradores = async (req, res) => {
  try {

    const administradores = await Administrador.findAll({
      attributes: { exclude: ['password'] },
      order: [['nombre', 'ASC']]
    });

    res.status(200).json({
      data: administradores
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener administradores',
      error: error.message
    });
  }
};

export const getAdministradorById = async (req, res) => {
  try {
    const { id } = req.params;
    const administrador = await Administrador.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!administrador) {
      return res.status(404).json({
        message: 'Administrador no encontrado'
      });
    }

    res.status(200).json({
      data: administrador
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener administrador',
      error: error.message
    });
  }
};


export const createAdministrador = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    
    const existeEmail = await Administrador.findOne({ where: { email } });
    if (existeEmail) {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    const nuevoAdministrador = await Administrador.create({
      nombre,
      apellido,
      email,
      password,
      rol: rol || 'admin'
    });

    const { password: _, ...adminSinPassword } = nuevoAdministrador.dataValues;
    
    res.status(201).json({
      message: 'Administrador creado exitosamente',
      data: adminSinPassword
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear administrador',
      error: error.message
    });
  }
};

export const updateAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, activo } = req.body;

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        message: 'Administrador no encontrado'
      });
    }

    if (email && email !== administrador.email) {
      const existeEmail = await Administrador.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(400).json({
          message: 'El email ya está en uso'
        });
      }
    }

    await administrador.update({
      nombre: nombre || administrador.nombre,
      apellido: apellido || administrador.apellido,
      email: email || administrador.email,
      rol: rol || administrador.rol,
      activo: activo !== undefined ? activo : administrador.activo
    });

    const { password: _, ...adminActualizado } = administrador.dataValues;
    
    res.status(200).json({
      message: 'Administrador actualizado exitosamente',
      data: adminActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar administrador',
      error: error.message
    });
  }
};

export const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        message: 'Administrador no encontrado'
      });
    }

    await administrador.update({ activo: false });

    res.status(200).json({
      message: 'Administrador desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar administrador',
      error: error.message
    });
  }
};

export const deleteAdministradorPermanente = async (req, res) => {
  try {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        message: 'Administrador no encontrado'
      });
    }

    await administrador.destroy();

    res.status(200).json({
      message: 'Administrador eliminado permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar administrador',
      error: error.message
    });
  }
}; 