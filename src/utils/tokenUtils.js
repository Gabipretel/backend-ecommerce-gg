import jwt from 'jsonwebtoken';

// Lectura de variables de entorno de JSON Web Token
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
const JWT_ISSUER = process.env.JWT_ISSUER;

/**
 * Genera un token de acceso
 * @param {Object} payload - Datos del usuario (id, email, type)
 * @returns {string} Token en string
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER
  });
};

/**
 * Genera un Token de refresco
 * @param {Object} payload - Datos del usuario (id, type)
 * @returns {string} Token de refresco en string
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: JWT_ISSUER
  });
};

/**
 * Verifica un token de acceso
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verifica un refresh token
 * @param {string} token - Refresh token a verificar
 * @returns {Object} Payload decodificado
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

/**
 * Genera un par de tokens (acceso + refresco)
 * @param {Object} user - Objeto usuario con id, email, type, etc.
 * @returns {Object} Objeto con accessToken y refreshToken
 */
export const generateTokenPair = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    type: user.type, // 'user' o 'admin'
    rol: user.rol || null // solo para administradores
  };

  const refreshPayload = {
    id: user.id,
    type: user.type
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(refreshPayload)
  };
};

/**
 * Extrae el token del header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token extraído o null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
