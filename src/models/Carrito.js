import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Carrito = sequelize.define(
  "Carrito",
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
    fecha_agregado: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "carritos",
    timestamps: true,
  }
);

export default Carrito;
