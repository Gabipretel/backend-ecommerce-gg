import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";

const DetalleOrden = sequelize.define("DetalleOrden", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ordenes',
      key: 'id',
    },
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id',
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: "detalle_ordenes",
  timestamps: true,
});

export default DetalleOrden; 