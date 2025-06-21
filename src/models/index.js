
import Administrador from "./Administrador.js";
import Usuario from "./Usuario.js";
import Categoria from "./Categoria.js";
import Marca from "./Marca.js";
import Producto from "./Producto.js";
import Direccion from "./Direccion.js";
import Carrito from "./Carrito.js";
import ItemCarrito from "./ItemCarrito.js";
import Orden from "./Orden.js";
import DetalleOrden from "./DetalleOrden.js";
import Pago from "./Pago.js";
import Opinion from "./Opinion.js";

// Relaciones

// Administrador -> Categoria (1:N)
Administrador.hasMany(Categoria, {
  foreignKey: "id_administrador",
  as: "categorias",
});
Categoria.belongsTo(Administrador, {
  foreignKey: "id_administrador",
  as: "administrador",
});

// Administrador -> Marca (1:N)
Administrador.hasMany(Marca, {
  foreignKey: "id_administrador",
  as: "marcas",
});
Marca.belongsTo(Administrador, {
  foreignKey: "id_administrador",
  as: "administrador",
});

// Administrador -> Producto (1:N)
Administrador.hasMany(Producto, {
  foreignKey: "id_administrador",
  as: "productos",
});
Producto.belongsTo(Administrador, {
  foreignKey: "id_administrador",
  as: "administrador",
});

// Categoria -> Producto (1:N)
Categoria.hasMany(Producto, {
  foreignKey: "id_categoria",
  as: "productos",
});
Producto.belongsTo(Categoria, {
  foreignKey: "id_categoria",
  as: "categoria",
});

// Marca -> Producto (1:N)
Marca.hasMany(Producto, {
  foreignKey: "id_marca",
  as: "productos",
});
Producto.belongsTo(Marca, {
  foreignKey: "id_marca",
  as: "marca",
});

// Usuario -> Direccion (1:N)
Usuario.hasMany(Direccion, {
  foreignKey: "id_usuario",
  as: "direcciones",
});
Direccion.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Usuario -> Carrito (1:1)
Usuario.hasOne(Carrito, {
  foreignKey: "id_usuario",
  as: "carrito",
});
Carrito.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Usuario -> Orden (1:N)
Usuario.hasMany(Orden, {
  foreignKey: "id_usuario",
  as: "ordenes",
});
Orden.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Usuario -> Opinion (1:N)
Usuario.hasMany(Opinion, {
  foreignKey: "id_usuario",
  as: "opiniones",
});
Opinion.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Carrito -> ItemCarrito (1:N)
Carrito.hasMany(ItemCarrito, {
  foreignKey: "id_carrito",
  as: "items",
});
ItemCarrito.belongsTo(Carrito, {
  foreignKey: "id_carrito",
  as: "carrito",
});

// Producto -> ItemCarrito (1:N)
Producto.hasMany(ItemCarrito, {
  foreignKey: "id_producto",
  as: "itemsCarrito",
});
ItemCarrito.belongsTo(Producto, {
  foreignKey: "id_producto",
  as: "producto",
});

// Direccion -> Orden (1:N)
Direccion.hasMany(Orden, {
  foreignKey: "id_direccion_envio",
  as: "ordenes",
});
Orden.belongsTo(Direccion, {
  foreignKey: "id_direccion_envio",
  as: "direccionEnvio",
});

// Orden -> DetalleOrden (1:N)
Orden.hasMany(DetalleOrden, {
  foreignKey: "id_orden",
  as: "detalles",
});
DetalleOrden.belongsTo(Orden, {
  foreignKey: "id_orden",
  as: "orden",
});

// Producto -> DetalleOrden (1:N)
Producto.hasMany(DetalleOrden, {
  foreignKey: "id_producto",
  as: "detallesOrden",
});
DetalleOrden.belongsTo(Producto, {
  foreignKey: "id_producto",
  as: "producto",
});

// Orden -> Pago (1:N)
Orden.hasMany(Pago, {
  foreignKey: "id_orden",
  as: "pagos",
});
Pago.belongsTo(Orden, {
  foreignKey: "id_orden",
  as: "orden",
});

// Producto -> Opinion (1:N)
Producto.hasMany(Opinion, {
  foreignKey: "id_producto",
  as: "opiniones",
});
Opinion.belongsTo(Producto, {
  foreignKey: "id_producto",
  as: "producto",
});

export {
  Administrador,
  Usuario,
  Categoria,
  Marca,
  Producto,
  Direccion,
  Carrito,
  ItemCarrito,
  Orden,
  DetalleOrden,
  Pago,
  Opinion,
};
