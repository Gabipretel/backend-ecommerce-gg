import Usuario from '../models/Usuario.js';
import Administrador from '../models/Administrador.js';
import { hashPassword, comparePassword, validatePassword } from '../utils/passwordUtils.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/tokenUtils.js';

/**
 * Registro de usuario 
 */
export const registerUser = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;


    if (!nombre || !apellido || !email || !password) {
      const error = new Error('Todos los campos son requeridos');
      error.statusCode = 400;
      throw error;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const error = new Error('La contraseña no es válida');
      error.statusCode = 400;
      error.details = passwordValidation.errors;
      return res.status(400).json({
        success: false,
        message: 'La contraseña no es válida',
        errors: passwordValidation.errors
      });
    }

    const hashedPassword = await hashPassword(password);

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      telefono
    });

    // Genera tokens de acceso y refresco
    const userForToken = {
      id: usuario.id,
      email: usuario.email,
      type: 'user'
    };
    const tokens = generateTokenPair(userForToken);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          fecha_registro: usuario.fecha_registro
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Registro de administrador (solo para superadmins)
 */
export const registerAdmin = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, rol = 'admin' } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !password) {
      const error = new Error('Nombre, apellido, email y contraseña son requeridos');
      error.statusCode = 400;
      throw error;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('El formato del email no es válido');
      error.statusCode = 400;
      throw error;
    }

    // Validar que el rol sea válido
    const rolesPermitidos = ['admin', 'superadmin'];
    if (!rolesPermitidos.includes(rol)) {
      const error = new Error('El rol debe ser "admin" o "superadmin"');
      error.statusCode = 400;
      throw error;
    }

    // Validar que el email no esté en uso
    const existeAdmin = await Administrador.findOne({ where: { email } });
    if (existeAdmin) {
      const error = new Error('Ya existe un administrador con este email');
      error.statusCode = 409;
      throw error;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const error = new Error('Contraseña no válida');
      error.statusCode = 400;
      error.details = passwordValidation.errors;
      throw error;
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear administrador
    const admin = await Administrador.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol
    });

    res.status(201).json({
      success: true,
      message: 'Administrador registrado exitosamente',
      data: {
        admin: {
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          email: admin.email,
          rol: admin.rol,
          fecha_registro: admin.fecha_registro
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login unificado para usuarios y administradores
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, type = 'user' } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      const error = new Error('Email y contraseña son requeridos');
      error.statusCode = 400;
      throw error;
    }

    let user = null;
    let Model = null;

    // Determinar el modelo según el tipo
    if (type === 'admin') {
      Model = Administrador;
    } else {
      Model = Usuario;
    }

    // Buscar usuario
    user = await Model.findOne({ where: { email } });

    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Verificar que el usuario esté activo
    if (!user.activo) {
      const error = new Error('Cuenta desactivada. Contacta al administrador');
      error.statusCode = 401;
      throw error;
    }

    // Comparar contraseñas
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Generar tokens
    const userForToken = {
      id: user.id,
      email: user.email,
      type: type,
      rol: user.rol || null
    };
    const tokens = generateTokenPair(userForToken);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          tipo: type,
          rol: user.rol || null,
          telefono: user.telefono || null
        },
        ...tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token para obtener nuevo token de acceso
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const error = new Error('Refresh token requerido');
      error.statusCode = 400;
      throw error;
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Buscar usuario
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

    // Generar nuevo par de tokens
    const userForToken = {
      id: user.id,
      email: user.email,
      type: decoded.type,
      rol: user.rol || null
    };
    const tokens = generateTokenPair(userForToken);

    res.json({
      success: true,
      message: 'Tokens renovados exitosamente',
      data: tokens
    });
  } catch (error) {
    next(error);
  }
};


