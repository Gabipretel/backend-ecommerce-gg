# 🛒 Backend E-commerce - Gamer Once, Gamer Always

### Alumno: Alan Gabriel Pretel

## 📋 Descripción del Proyecto

Backend completo para una plataforma de e-commerce especializada en productos gaming. Este sistema proporciona una API RESTful robusta que maneja usuarios, productos, carritos de compra, órdenes, pagos y un chatbot inteligente con IA.

## ✨ Funcionalidades Principales

### 🔐 Autenticación y Autorización
- Registro y login de usuarios y administradores
- Autenticación JWT con refresh tokens
- Middleware de autorización por roles
- Encriptación de contraseñas con bcrypt

### 👥 Gestión de Usuarios
- CRUD completo de usuarios
- Gestión de direcciones de envío
- Perfiles de usuario personalizables
- Soft delete para preservar datos

### 🎮 Catálogo de Productos
- Gestión completa de productos gaming
- Categorías y marcas organizadas
- Subida de imágenes con Cloudinary
- Galería de imágenes por producto
- Sistema de inventario

### 🛒 Carrito de Compras
- Carrito persistente por usuario
- Agregar/quitar productos
- Actualización de cantidades
- Cálculo automático de totales

### 📦 Sistema de Órdenes
- Creación y gestión de órdenes
- Seguimiento de estados
- Detalles completos de compra
- Historial de órdenes por usuario

### 💳 Procesamiento de Pagos
- Gestión de métodos de pago
- Registro de transacciones
- Estados de pago actualizables

### ⭐ Sistema de Opiniones
- Reseñas y calificaciones de productos
- Comentarios de usuarios
- Moderación de contenido

### 🤖 Chatbot Inteligente
- Integración con Groq AI
- Asistencia especializada en gaming
- Contexto conversacional
- Múltiples temáticas de consulta

### 📧 Notificaciones por Email
- Confirmaciones de registro
- Notificaciones de órdenes
- Emails transaccionales

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para base de datos
- **MySQL** - Base de datos relacional

### Autenticación y Seguridad
- **JWT** - JSON Web Tokens
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Control de acceso entre dominios

### Servicios Externos
- **Cloudinary** - Almacenamiento de imágenes
- **Groq AI** - Inteligencia artificial para chatbot
- **Nodemailer** - Envío de emails

### Herramientas de Desarrollo
- **Nodemon** - Recarga automática en desarrollo
- **Morgan** - Logger de peticiones HTTP
- **Multer** - Manejo de archivos multipart
- **dotenv** - Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
backend-ecommerce-gg/
├── src/
│   ├── app/
│   │   ├── app.js              # Configuración principal de Express
│   │   └── cloudinary.js       # Configuración de Cloudinary
│   ├── config/
│   │   └── groq.js            # Configuración de Groq AI
│   ├── controllers/           # Lógica de negocio
│   ├── db/
│   │   └── connection.js      # Conexión a base de datos
│   ├── middleware/            # Middlewares personalizados
│   ├── models/               # Modelos de Sequelize
│   ├── routes/               # Definición de rutas
│   ├── services/             # Servicios externos
│   └── utils/                # Utilidades y helpers
├── scripts/
│   └── resetDatabase.js      # Script para resetear BD
├── index.js                  # Punto de entrada
└── package.json             # Dependencias y scripts
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL (v8 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd backend-ecommerce-gg
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=ecommerce_gaming
DB_PORT=3306

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Groq AI
GROQ_API_KEY=tu_groq_api_key

# Email (Nodemailer)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Configurar base de datos
```bash
# Crear base de datos en MySQL
CREATE DATABASE ecommerce_gaming;

# Ejecutar migraciones (automático al iniciar)
npm start
```

### 5. (Opcional) Resetear base de datos
```bash
npm run db:reset
```

## 🏃‍♂️ Ejecutar el Proyecto

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 API Endpoints

### Base URL: `http://localhost:3000/api`

### 🔐 Autenticación (`/auth`)
```http
POST /auth/register          # Registro de usuario
POST /auth/login-user        # Login de usuario
POST /auth/login-admin       # Login de administrador
POST /auth/register-admin    # Registro de administrador
POST /auth/refresh           # Renovar token
```

### 👥 Usuarios (`/usuarios`)
```http
GET    /usuarios             # Listar usuarios
GET    /usuarios/:id         # Obtener usuario por ID
POST   /usuarios             # Crear usuario
PUT    /usuarios/:id         # Actualizar usuario
DELETE /usuarios/:id         # Eliminar usuario (soft delete)
DELETE /usuarios/:id/permanent # Eliminar permanentemente
```

### 🎮 Productos (`/productos`)
```http
GET    /productos            # Listar productos
GET    /productos/:id        # Obtener producto por ID
POST   /productos            # Crear producto
PUT    /productos/:id        # Actualizar producto
DELETE /productos/:id        # Desactivar producto
DELETE /productos/:id/permanent # Eliminar permanentemente

# Gestión de imágenes
POST   /productos/upload/imagen-principal    # Subir imagen principal
POST   /productos/upload/galeria            # Subir galería de imágenes
DELETE /productos/imagen/:public_id         # Eliminar imagen específica
DELETE /productos/imagenes/multiples        # Eliminar múltiples imágenes
```

### 🛒 Carrito (`/carrito`)
```http
GET    /carrito                              # Listar carritos
GET    /carrito/usuario/:userId              # Carrito por usuario
POST   /carrito/usuario/:userId/add          # Agregar producto
PUT    /carrito/usuario/:userId/item/:itemId # Actualizar cantidad
DELETE /carrito/usuario/:userId/item/:itemId # Quitar producto
DELETE /carrito/usuario/:userId/clear        # Vaciar carrito
```

### 📦 Órdenes (`/ordenes`)
```http
GET    /ordenes                    # Listar órdenes
GET    /ordenes/usuario/:userId    # Órdenes por usuario
POST   /ordenes                   # Crear orden
PUT    /ordenes/:id               # Actualizar orden
DELETE /ordenes/:id               # Eliminar orden
```

### 🏷️ Categorías (`/categorias`)
```http
GET    /categorias        # Listar categorías
GET    /categorias/:id    # Obtener categoría por ID
POST   /categorias        # Crear categoría
PUT    /categorias/:id    # Actualizar categoría
DELETE /categorias/:id    # Eliminar categoría
```

### 🏢 Marcas (`/marcas`)
```http
GET    /marcas        # Listar marcas
GET    /marcas/:id    # Obtener marca por ID
POST   /marcas        # Crear marca
PUT    /marcas/:id    # Actualizar marca
DELETE /marcas/:id    # Eliminar marca
```

### 📍 Direcciones (`/direcciones`)
```http
GET    /direcciones                    # Listar direcciones
GET    /direcciones/:id                # Obtener dirección por ID
GET    /direcciones/usuario/:userId    # Direcciones por usuario
POST   /direcciones                   # Crear dirección
PUT    /direcciones/:id               # Actualizar dirección
DELETE /direcciones/:id               # Eliminar dirección
```

### 💳 Pagos (`/pagos`)
```http
GET    /pagos        # Listar pagos
GET    /pagos/:id    # Obtener pago por ID
POST   /pagos        # Crear pago
PUT    /pagos/:id    # Actualizar pago
DELETE /pagos/:id    # Eliminar pago
```

### ⭐ Opiniones (`/opiniones`)
```http
GET    /opiniones                      # Listar opiniones
GET    /opiniones/:id                  # Obtener opinión por ID
GET    /opiniones/producto/:productoId # Opiniones por producto
POST   /opiniones                     # Crear opinión
PUT    /opiniones/:id                 # Actualizar opinión
DELETE /opiniones/:id                 # Eliminar opinión
```

### 🤖 Chatbot (`/chatbot`)
```http
POST /chatbot/mensaje    # Enviar mensaje al chatbot
```

**Ejemplo de uso del chatbot:**
```json
{
  "mensaje": "¿Qué GPU me recomiendan para gaming en 4K?",
  "tematica": "GAMING",
  "historial": [
    {
      "usuario": "Hola",
      "asistente": "¡Hola! ¿En qué puedo ayudarte hoy?"
    }
  ]
}
```

### 📧 Email (`/email`)
```http
POST /email/send    # Enviar email
```

## 🗄️ Modelo de Base de Datos

### Entidades Principales
- **Usuario**: Información de clientes
- **Administrador**: Gestores del sistema
- **Producto**: Catálogo de productos gaming
- **Categoria**: Clasificación de productos
- **Marca**: Fabricantes de productos
- **Carrito**: Carrito de compras por usuario
- **ItemCarrito**: Productos en el carrito
- **Orden**: Órdenes de compra
- **DetalleOrden**: Productos en cada orden
- **Pago**: Información de pagos
- **Direccion**: Direcciones de envío
- **Opinion**: Reseñas de productos

### Relaciones
- Usuario 1:1 Carrito
- Usuario 1:N Direcciones, Órdenes, Opiniones
- Carrito 1:N ItemCarrito
- Producto 1:N ItemCarrito, DetalleOrden, Opiniones
- Orden 1:N DetalleOrden, Pagos
- Categoria 1:N Productos
- Marca 1:N Productos

## 🔧 Scripts Disponibles

```bash
npm start        # Iniciar servidor en producción
npm run dev      # Iniciar servidor en desarrollo con nodemon
npm run db:reset # Resetear base de datos (elimina todos los datos)
```

## 🌐 CORS y Seguridad

El servidor está configurado para aceptar peticiones desde:
- `http://localhost:5173` (Frontend Vite)
- `http://localhost:3000` (Desarrollo local)

Métodos HTTP permitidos: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`

## 📝 Notas Importantes

1. **Variables de Entorno**: Asegúrate de configurar todas las variables de entorno antes de ejecutar el proyecto.

2. **Base de Datos**: El proyecto usa Sequelize con sincronización automática. En el primer inicio se crearán todas las tablas.

3. **Imágenes**: Las imágenes se almacenan en Cloudinary. Configura tu cuenta para el manejo de archivos.

4. **Chatbot**: Requiere una API key de Groq AI para funcionar correctamente.

5. **Emails**: Configura Nodemailer con tu proveedor de email preferido.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado con  ❤️  por Alan Gabriel Pretel ** 🎮