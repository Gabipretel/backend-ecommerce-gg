import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Orden = sequelize.define(
  "Orden",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    id_direccion_envio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "direcciones",
        key: "id",
      },
    },
    numero_orden: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fecha_orden: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "ordenes",
    timestamps: true,
  }
);

export default Orden;
