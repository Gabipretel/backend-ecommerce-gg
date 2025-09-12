import { Usuario, Direccion, Carrito, Orden } from "../models/index.js";


export const getUsuarios = async (req, res) => {
  try {
    const { 
      nombre, 
      apellido, 
      activo, 
      orderBy = 'createdAt', 
      orderDirection = 'DESC',
      limit,
      offset 
    } = req.query;

    // Construye condiciones de filtrado
    const whereConditions = {};
    
    if (nombre) {
      whereConditions.nombre = {
        [Usuario.sequelize.Sequelize.Op.like]: `%${nombre}%`
      };
    }
    
    if (apellido) {
      whereConditions.apellido = {
        [Usuario.sequelize.Sequelize.Op.like]: `%${apellido}%`
      };
    }
    
    if (activo !== undefined) {
      whereConditions.activo = activo === 'true';
    }

    // Valida orderBy (ordenamiento)
    const validOrderFields = ['nombre', 'apellido', 'fecha_registro', 'createdAt', 'updatedAt', 'activo'];
    const orderField = validOrderFields.includes(orderBy) ? orderBy : 'createdAt';
    
    // Valida orderDirection (dirección del ordenamiento)
    const direction = orderDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Configura opciones de consulta
    const queryOptions = {
      where: whereConditions,
      attributes: { exclude: ['password'] },
      order: [[orderField, direction]]
    };

    // Agrega paginación si se proporciona
    if (limit) {
      queryOptions.limit = parseInt(limit);
      if (offset) {
        queryOptions.offset = parseInt(offset);
      }
    }

    const usuarios = await Usuario.findAll(queryOptions);
    
    // Obtiene conteo total para paginación
    const totalCount = await Usuario.count({ where: whereConditions });

    res.status(200).json({
      data: usuarios,
      pagination: {
        total: totalCount,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : null
      },
      filters: {
        nombre,
        apellido,
        activo,
        orderBy: orderField,
        orderDirection: direction
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      telefono
    });

    const { password: _, ...usuarioSinPassword } = nuevoUsuario.dataValues;
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      data: usuarioSinPassword
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};


export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, activo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    if (email && email !== usuario.email) {
      const existeEmail = await Usuario.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
    }

    await usuario.update({
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      telefono: telefono || usuario.telefono,
      activo: activo !== undefined ? activo : usuario.activo
    });

    const { password: _, ...usuarioActualizado } = usuario.dataValues;
    
    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    await usuario.update({ activo: false });

    res.status(200).json({
      message: 'Usuario desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

export const deleteUsuarioPermanente = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    await usuario.destroy();

    res.status(200).json({
      message: 'Usuario eliminado permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
}; 