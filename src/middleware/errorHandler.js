const errorHandler = (err, req, res, next) => {
  console.log("Error:", err.stack);

  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));
    return res.status(400).json({
      message: "Error de validación",
      errors,
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0].path;
    return res.status(409).json({
      message: `El ${field} ya está en uso`,
      field,
    });
  }

  // Errores de JSON Web Token
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expirado",
    });
  }

  // Error personalizado por estado de código
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Error interno del servidor",
  });
};

export default errorHandler;
