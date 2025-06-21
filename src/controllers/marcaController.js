import { Marca, Administrador, Producto } from "../models/index.js";


export const getMarcas = async (req, res) => {
  try {

    const marcas = await Marca.findAll({
      order: [['nombre', 'ASC']]
    });
    if(marcas.length === 0){
      return res.status(404).json({
        message: 'No hay marcas cargadas'
      });
    }
    res.status(200).json({
      data: marcas
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener marcas',
      error: error.message
    });
  }
};

export const getMarcaById = async (req, res) => {
  try {
    const { id } = req.params;
    const marca = await Marca.findByPk(id, {
    });

    if (!marca) {
      return res.status(404).json({
        message: 'Marca no encontrada'
      });
    }

    res.status(200).json({
      data: marca
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener marca',
      error: error.message
    });
  }
};


export const createMarca = async (req, res) => {
  try {
    const { id_administrador, nombre, descripcion } = req.body;
    
    const administrador = await Administrador.findByPk(id_administrador);
    if (!administrador) {
      return res.status(400).json({
        message: 'Administrador no válido'
      });
    }

    const nuevaMarca = await Marca.create({
      id_administrador,
      nombre,
      descripcion
    });
    
    res.status(201).json({
      message: 'Marca creada exitosamente',
      data: nuevaMarca
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear marca',
      error: error.message
    });
  }
};


export const updateMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    const marca = await Marca.findByPk(id);
    if (!marca) {
      return res.status(404).json({
        message: 'Marca no encontrada'
      });
    }

    await marca.update({
      nombre: nombre || marca.nombre,
      descripcion: descripcion || marca.descripcion,
      activo: activo !== undefined ? activo : marca.activo
    });

    
    res.status(200).json({
      message: 'Marca actualizada exitosamente',
      data: marca
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar marca',
      error: error.message
    });
  }
};


export const deleteMarca = async (req, res) => {
  try {
    const { id } = req.params;

    const marca = await Marca.findByPk(id);
    if (!marca) {
      return res.status(404).json({
        message: 'Marca no encontrada'
      });
    }

    await marca.update({ activo: false });

    res.status(200).json({
      message: 'Marca desactivada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar marca',
      error: error.message
    });
  }
};


export const deleteMarcaPermanente = async (req, res) => {
  try {
    const { id } = req.params;

    const marca = await Marca.findByPk(id);
    if (!marca) {
      return res.status(404).json({
        message: 'Marca no encontrada'
      });
    }

    await marca.destroy();

    res.status(200).json({
      message: 'Marca eliminada permanentemente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar marca',
      error: error.message
    });
  }
}; 