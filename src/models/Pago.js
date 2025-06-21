import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const Pago = sequelize.define(
  "Pago",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ordenes",
        key: "id",
      },
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_transaccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completado', 'rechazado'),
      allowNull: false,
      defaultValue: "pendiente",
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pagos",
    timestamps: true,
  }
);

export default Pago;
