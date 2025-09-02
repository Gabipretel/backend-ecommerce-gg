import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';

// Middleware para verificar JSON Web Token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Token de acceso requerido');
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.substring(7); // Remueve  'Bearer ' 

    // Decodifica el token y devuelve los campos que se encuentran en el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario basado en el tipo especificado en el token
    let user = null;
    if (decoded.type === 'admin') {
      user = await Administrador.findByPk(decoded.id);
    } else {
      user = await Usuario.findByPk(decoded.id);
    }

    if (!user || !user.activo) {
      const error = new Error('Usuario no encontrado o inactivo');
      error.statusCode = 401;
      throw error;
    }

    // Agregar información del usuario al objeto request
    req.user = {
      id: user.id,
      email: user.email,
      type: decoded.type,
      rol: user.rol || 'user' // Los usuarios normales no tienen rol, los admins sí
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar si es administrador
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.type !== 'admin') {
      const error = new Error('Acceso denegado. Se requieren permisos de administrador');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar si es superadmin
export const requireSuperAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.type !== 'admin' || req.user.rol !== 'superadmin') {
      const error = new Error('Acceso denegado. Se requieren permisos de superadministrador');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
