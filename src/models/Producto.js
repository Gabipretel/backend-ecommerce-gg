import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Producto = sequelize.define(
  "Producto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categorias",
        key: "id",
      },
    },
    id_marca: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "marcas",
        key: "id",
      },
    },
    id_administrador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "administradores",
        key: "id",
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imagen_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    galeria_imagenes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "productos",
    timestamps: true,
  }
);

export default Producto;
