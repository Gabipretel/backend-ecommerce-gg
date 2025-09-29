import { Producto, Categoria, Marca, Administrador, Opinion, Usuario } from "../models/index.js";
import { cloudinaryUploadImage, cloudinaryRemoveImage, cloudinaryRemoveMultipleImage } from "../app/cloudinary.js";
import fs from "fs";


export const getProductos = async (req, res) => {
  try {
    const { 
      nombre, 
      activo, 
      destacado,
      id_categoria,
      id_marca,
      orderBy = 'createdAt', 
      orderDirection = 'DESC',
      limit,
      offset 
    } = req.query;

    // Construye condiciones de filtrado
    const whereConditions = {};
    
    if (nombre) {
      whereConditions.nombre = {
        [Producto.sequelize.Sequelize.Op.like]: `%${nombre}%`
      };
    }
    
    if (activo !== undefined) {
      whereConditions.activo = activo === 'true';
    }

    if (destacado !== undefined) {
      whereConditions.destacado = destacado === 'true';
    }

    if (id_categoria) {
      whereConditions.id_categoria = parseInt(id_categoria);
    }

    if (id_marca) {
      whereConditions.id_marca = parseInt(id_marca);
    }

    // Valida orderBy (ordenamiento)
    const validOrderFields = ['nombre', 'precio', 'stock', 'createdAt', 'updatedAt', 'activo', 'destacado'];
    const orderField = validOrderFields.includes(orderBy) ? orderBy : 'createdAt';
    
    // Valida orderDirection (dirección del ordenamiento)
    const direction = orderDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Configura opciones de consulta
    const queryOptions = {
      where: whereConditions,
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Marca, as: 'marca' },
      ],
      order: [[orderField, direction]]
    };

    // Agrega paginación si se proporciona
    if (limit) {
      queryOptions.limit = parseInt(limit);
      if (offset) {
        queryOptions.offset = parseInt(offset);
      }
    }

    const productos = await Producto.findAll(queryOptions);
    
    // Obtiene conteo total para paginación
    const totalCount = await Producto.count({ where: whereConditions });

    res.status(200).json({
      data: productos,
      pagination: {
        total: totalCount,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : null
      },
      filters: {
        nombre,
        activo,
        destacado,
        id_categoria,
        id_marca,
        orderBy: orderField,
        orderDirection: direction
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Marca, as: 'marca' },
      ]
    });

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { 
      id_categoria, 
      id_marca, 
      id_administrador, 
      nombre, 
      descripcion, 
      sku, 
      precio, 
      stock, 
      imagen_url, 
      galeria_imagenes,
      destacado 
    } = req.body;

    const nuevoProducto = await Producto.create({
      id_categoria,
      id_marca,
      id_administrador,
      nombre,
      descripcion,
      sku,
      precio,
      stock: stock || 0,
      imagen_url,
      galeria_imagenes: galeria_imagenes || [],
      destacado: destacado || false
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      data: nuevoProducto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear producto',
      error: error.message
    });
  }
};


export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      id_categoria, 
      id_marca, 
      nombre, 
      descripcion, 
      sku, 
      precio, 
      stock, 
      imagen_url, 
      galeria_imagenes,
      activo, 
      destacado 
    } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await producto.update({
      id_categoria: id_categoria || producto.id_categoria,
      id_marca: id_marca || producto.id_marca,
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      sku: sku || producto.sku,
      precio: precio || producto.precio,
      stock: stock !== undefined ? stock : producto.stock,
      imagen_url: imagen_url || producto.imagen_url,
      galeria_imagenes: galeria_imagenes !== undefined ? galeria_imagenes : producto.galeria_imagenes,
      activo: activo !== undefined ? activo : producto.activo,
      destacado: destacado !== undefined ? destacado : producto.destacado
    });

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};


export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await producto.update({ activo: false });

    res.status(200).json({
      message: 'Producto desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};


export const deleteProductoPermanente = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    // Eliminar imágenes de Cloudinary antes de eliminar el producto
    try {
      // Eliminar imagen principal si existe
      if (producto.imagen_url) {
        const publicId = producto.imagen_url.split('/').pop().split('.')[0];
        await cloudinaryRemoveImage(publicId);
      }

      // Eliminar imágenes de galería si existen
      if (producto.galeria_imagenes && producto.galeria_imagenes.length > 0) {
        const publicIds = producto.galeria_imagenes.map(url => 
          url.split('/').pop().split('.')[0]
        );
        await cloudinaryRemoveMultipleImage(publicIds);
      }
    } catch (cloudinaryError) {
      console.log('Error eliminando imágenes de Cloudinary:', cloudinaryError);
      // Continuar con la eliminación del producto aunque falle la eliminación de imágenes
    }

    await producto.destroy();

    res.status(200).json({
      message: 'Producto eliminado permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

// ===============================
// FUNCIONES DE MANEJO DE IMÁGENES
// ===============================

// Subir imagen principal del producto
export const uploadImagenPrincipal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No se proporcionó ninguna imagen'
      });
    }

    // Subir imagen a Cloudinary
    const result = await cloudinaryUploadImage(req.file.path);
    
    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: 'Imagen subida exitosamente',
      data: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });
  } catch (error) {
    // Eliminar archivo temporal en caso de error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.log('Error eliminando archivo temporal:', unlinkError);
      }
    }

    res.status(500).json({
      message: 'Error al subir imagen',
      error: error.message
    });
  }
};

// Subir múltiples imágenes para galería
export const uploadImagenesGaleria = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No se proporcionaron imágenes'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinaryUploadImage(file.path);
      // Eliminar archivo temporal
      fs.unlinkSync(file.path);
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Imágenes subidas exitosamente',
      data: uploadedImages
    });
  } catch (error) {
    // Eliminar archivos temporales en caso de error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.log('Error eliminando archivo temporal:', unlinkError);
        }
      });
    }

    res.status(500).json({
      message: 'Error al subir imágenes',
      error: error.message
    });
  }
};

// Eliminar imagen específica de Cloudinary
export const eliminarImagen = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        message: 'Public ID requerido'
      });
    }

    const result = await cloudinaryRemoveImage(public_id);

    if (result.result === 'ok') {
      res.status(200).json({
        message: 'Imagen eliminada exitosamente'
      });
    } else {
      res.status(404).json({
        message: 'Imagen no encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar imagen',
      error: error.message
    });
  }
};

// Eliminar múltiples imágenes de Cloudinary
export const eliminarImagenesMultiples = async (req, res) => {
  try {
    const { public_ids } = req.body;

    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
      return res.status(400).json({
        message: 'Array de public IDs requerido'
      });
    }

    const result = await cloudinaryRemoveMultipleImage(public_ids);

    res.status(200).json({
      message: 'Imágenes eliminadas exitosamente',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar imágenes',
      error: error.message
    });
  }
}; 