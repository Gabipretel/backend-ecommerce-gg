import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Marca = sequelize.define(
  "Marca",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "marcas",
    timestamps: true,
  }
);

export default Marca;
