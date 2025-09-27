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

    // Valida los campos obligatorios
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
        errors: ['Nombre, apellido, email y contraseña son obligatorios']
      });
    }

    // Valida el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido',
        errors: ['Ingresa un email válido']
      });
    }

    // Verifica si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un usuario con este email',
        errors: ['El email ya está registrado en el sistema']
      });
    }

    // Valida contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
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
    // Maneja errores específicos de la base de datos
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un usuario con este email',
        errors: ['El email ya está registrado en el sistema']
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    // Para otros errores, usa el middleware de error general.
    next(error);
  }
};

/**
 * Registro de administrador
 */
export const registerAdmin = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, rol = 'admin' } = req.body;

    // Valida los campos obligatorios
    if (!nombre || !apellido || !email || !password) {
      const error = new Error('Nombre, apellido, email y contraseña son requeridos');
      error.statusCode = 400;
      throw error;
    }

    // Valida el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error('El formato del email no es válido');
      error.statusCode = 400;
      throw error;
    }

    // Valida que el rol sea válido
    const rolesPermitidos = ['admin', 'superadmin'];
    if (!rolesPermitidos.includes(rol)) {
      const error = new Error('El rol debe ser "admin" o "superadmin"');
      error.statusCode = 400;
      throw error;
    }

    // Valida que el email no esté en uso
    const existeAdmin = await Administrador.findOne({ where: { email } });
    if (existeAdmin) {
      const error = new Error('Ya existe un administrador con este email');
      error.statusCode = 409;
      throw error;
    }

    // Valida contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const error = new Error('Contraseña no válida');
      error.statusCode = 400;
      error.details = passwordValidation.errors;
      throw error;
    }

    // Hashea contraseña
    const hashedPassword = await hashPassword(password);

    // Crea administrador
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
 * Login específico para usuarios
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Valida los campos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
        errors: ['Ambos campos son obligatorios']
      });
    }

    // Busca usuario
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        errors: ['El email o contraseña son incorrectos']
      });
    }

    // Verifica que el usuario esté activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al administrador',
        errors: ['Tu cuenta ha sido desactivada']
      });
    }

    // Compara contraseñas
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        errors: ['El email o contraseña son incorrectos']
      });
    }

    // Genera tokens
    const userForToken = {
      id: user.id,
      email: user.email,
      type: 'user',
      rol: null
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
          tipo: 'user',
          rol: null,
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
 * Login específico para administradores
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Valida los campos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
        errors: ['Ambos campos son obligatorios']
      });
    }

    // Busca administrador
    const admin = await Administrador.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        errors: ['El email o contraseña son incorrectos']
      });
    }

    // Verifica que el administrador esté activo
    if (!admin.activo) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al superadministrador',
        errors: ['Tu cuenta de administrador ha sido desactivada']
      });
    }

    // Compara contraseñas
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        errors: ['El email o contraseña son incorrectos']
      });
    }

    // Genera tokens
    const adminForToken = {
      id: admin.id,
      email: admin.email,
      type: 'admin',
      rol: admin.rol
    };
    const tokens = generateTokenPair(adminForToken);

    res.json({
      success: true,
      message: 'Inicio de sesión de administrador exitoso',
      data: {
        admin: {
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          email: admin.email,
          tipo: 'admin',
          rol: admin.rol
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
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido',
        errors: ['El refresh token es obligatorio']
      });
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
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo',
        errors: ['El usuario no existe o ha sido desactivado']
      });
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


