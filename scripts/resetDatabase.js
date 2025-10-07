import sequelize from "../src/db/connection.js";
import { 
  Administrador, 
  Categoria, 
  Marca, 
  Producto, 
  Usuario,
  Carrito,
  ItemCarrito,
  Orden,
  DetalleOrden,
  Pago,
  Direccion,
  Opinion
} from "../src/models/index.js";

// Script principal para resetear completamente la base de datos
const resetDatabase = async () => {
  try {
    console.log('🔄 Iniciando reset completo de la base de datos...');
    
    // 1. Obtener nombre de la base de datos
    const [results] = await sequelize.query("SELECT DATABASE() as db_name");
    const dbName = results[0].db_name;
    console.log(`📊 Base de datos: ${dbName}`);
    
    // 2. Desactivar verificación de claves foráneas
    console.log('🔓 Desactivando verificación de claves foráneas...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 3. Obtener todas las tablas
    console.log('📋 Obteniendo lista de tablas...');
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = '${dbName}'
    `);
    
    // 4. Eliminar todas las tablas
    console.log('🗑️  Eliminando tablas existentes...');
    for (const table of tables) {
      await sequelize.query(`DROP TABLE IF EXISTS \`${table.TABLE_NAME}\``);
      console.log(`   ✅ Tabla ${table.TABLE_NAME} eliminada`);
    }
    
    // 5. Reactivar verificación de claves foráneas
    console.log('🔒 Reactivando verificación de claves foráneas...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    // 6. Crear todas las tablas con la nueva estructura
    console.log('📝 Creando tablas con nueva estructura...');
    await sequelize.sync({ force: true });
    console.log('✅ Todas las tablas creadas');
    
    // 7. Poblar con datos de seed
    console.log('🌱 Poblando base de datos con datos de prueba...');
    await seedDatabase();
    
    console.log('🎉 ¡Reset de base de datos completado exitosamente!');
    console.log('📊 Resumen:');
    console.log('   - Base de datos recreada con nueva estructura');
    console.log('   - Todas las tablas creadas');
    console.log('   - Datos de prueba insertados');
    console.log('   - Estructura de imágenes actualizada a objetos');
    
  } catch (error) {
    console.error('❌ Error durante el reset:', error.message);
    console.log('💡 Verifica que la conexión a la base de datos esté configurada correctamente');
  } finally {
    await sequelize.close();
  }
};

// Función para poblar la base de datos (extraída del seedDatabase.js)
const seedDatabase = async () => {
  try {
    // Crear administrador por defecto
    console.log('👤 Creando administrador por defecto...');
    const administrador = await Administrador.create({
      nombre: 'Admin',
      apellido: 'TechStore',
      email: 'admin@techstore.com',
      password: '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', // password: admin123
      rol: 'superadmin',
      fecha_registro: new Date(),
      activo: true
    });
    console.log('✅ Administrador creado');

    // Crear categorías
    console.log('📂 Creando categorías...');
    const categorias = [
      { id_administrador: administrador.id, nombre: 'Procesadores', descripcion: 'CPUs para computadoras', activo: true },
      { id_administrador: administrador.id, nombre: 'Tarjetas Gráficas', descripcion: 'GPUs para gaming y trabajo', activo: true },
      { id_administrador: administrador.id, nombre: 'Memoria RAM', descripcion: 'Memoria de acceso aleatorio', activo: true },
      { id_administrador: administrador.id, nombre: 'Placas Madre', descripcion: 'Motherboards para PC', activo: true },
      { id_administrador: administrador.id, nombre: 'Fuentes de Poder', descripcion: 'PSUs para alimentar componentes', activo: true },
      { id_administrador: administrador.id, nombre: 'Gabinetes', descripcion: 'Cases para PC', activo: true },
      { id_administrador: administrador.id, nombre: 'Monitores', descripcion: 'Pantallas para computadoras', activo: true },
      { id_administrador: administrador.id, nombre: 'Laptops', descripcion: 'Computadoras portátiles', activo: true }
    ];

    const categoriasCreadas = await Categoria.bulkCreate(categorias);
    console.log('✅ Categorías creadas');

    // Crear marcas
    console.log('🏷️ Creando marcas...');
    const marcas = [
      { id_administrador: administrador.id, nombre: 'Intel', descripcion: 'Procesadores Intel', activo: true },
      { id_administrador: administrador.id, nombre: 'AMD', descripcion: 'Procesadores AMD', activo: true },
      { id_administrador: administrador.id, nombre: 'NVIDIA', descripcion: 'Tarjetas gráficas NVIDIA', activo: true },
      { id_administrador: administrador.id, nombre: 'ASUS', descripcion: 'Componentes ASUS', activo: true },
      { id_administrador: administrador.id, nombre: 'MSI', descripcion: 'Componentes MSI', activo: true },
      { id_administrador: administrador.id, nombre: 'Gigabyte', descripcion: 'Componentes Gigabyte', activo: true },
      { id_administrador: administrador.id, nombre: 'Corsair', descripcion: 'Memoria y periféricos Corsair', activo: true },
      { id_administrador: administrador.id, nombre: 'G.Skill', descripcion: 'Memoria G.Skill', activo: true },
      { id_administrador: administrador.id, nombre: 'Kingston', descripcion: 'Memoria Kingston', activo: true },
      { id_administrador: administrador.id, nombre: 'EVGA', descripcion: 'Fuentes EVGA', activo: true },
      { id_administrador: administrador.id, nombre: 'Seasonic', descripcion: 'Fuentes Seasonic', activo: true },
      { id_administrador: administrador.id, nombre: 'NZXT', descripcion: 'Gabinetes NZXT', activo: true },
      { id_administrador: administrador.id, nombre: 'Cooler Master', descripcion: 'Gabinetes Cooler Master', activo: true },
      { id_administrador: administrador.id, nombre: 'Samsung', descripcion: 'Monitores Samsung', activo: true },
      { id_administrador: administrador.id, nombre: 'LG', descripcion: 'Monitores LG', activo: true },
      { id_administrador: administrador.id, nombre: 'Acer', descripcion: 'Monitores Acer', activo: true },
      { id_administrador: administrador.id, nombre: 'Dell', descripcion: 'Laptops Dell', activo: true },
      { id_administrador: administrador.id, nombre: 'HP', descripcion: 'Laptops HP', activo: true },
      { id_administrador: administrador.id, nombre: 'Lenovo', descripcion: 'Laptops Lenovo', activo: true },
      { id_administrador: administrador.id, nombre: 'Apple', descripcion: 'Laptops Apple', activo: true }
    ];

    const marcasCreadas = await Marca.bulkCreate(marcas);
    console.log('✅ Marcas creadas');

    // Crear productos con nueva estructura de imágenes
    console.log('🛍️ Creando productos...');
    const productos = [
      {
        id_categoria: categoriasCreadas[0].id, // Procesadores
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i7-13700K",
        descripcion: "Procesador Intel de 13va generación con 16 núcleos (8P+8E) y 24 hilos. Base 3.4GHz, Boost 5.4GHz. Socket LGA1700.",
        sku: "INT-I7-13700K",
        precio: 450.00,
        stock: 15,
        imagen_principal: {
          url: "https://res.cloudinary.com/demo/image/upload/v1234567890/intel-i7-13700k.jpg",
          public_id: "productos/intel-i7-13700k"
        },
        galeria_imagenes: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567891/intel-i7-13700k-front.jpg",
            public_id: "productos/intel-i7-13700k-front"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567892/intel-i7-13700k-back.jpg",
            public_id: "productos/intel-i7-13700k-back"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567893/intel-i7-13700k-box.jpg",
            public_id: "productos/intel-i7-13700k-box"
          }
        ],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[1].id, // Tarjetas Gráficas
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "ASUS RTX 4080 ROG Strix",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4080 con 16GB GDDR6X. Ideal para gaming 4K y trabajo creativo.",
        sku: "ASUS-RTX4080-ROG",
        precio: 1200.00,
        stock: 8,
        imagen_principal: {
          url: "https://res.cloudinary.com/demo/image/upload/v1234567904/asus-rtx-4080-rog.jpg",
          public_id: "productos/asus-rtx-4080-rog"
        },
        galeria_imagenes: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567905/asus-rtx-4080-rog-front.jpg",
            public_id: "productos/asus-rtx-4080-rog-front"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567906/asus-rtx-4080-rog-back.jpg",
            public_id: "productos/asus-rtx-4080-rog-back"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567907/asus-rtx-4080-rog-rgb.jpg",
            public_id: "productos/asus-rtx-4080-rog-rgb"
          }
        ],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[2].id, // Memoria RAM
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Vengeance RGB 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3200MHz con iluminación RGB. Ideal para gaming y trabajo.",
        sku: "COR-VEN-RGB-32GB",
        precio: 180.00,
        stock: 20,
        imagen_principal: {
          url: "https://res.cloudinary.com/demo/image/upload/v1234567917/corsair-vengeance-rgb.jpg",
          public_id: "productos/corsair-vengeance-rgb"
        },
        galeria_imagenes: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567918/corsair-vengeance-rgb-front.jpg",
            public_id: "productos/corsair-vengeance-rgb-front"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567919/corsair-vengeance-rgb-rgb.jpg",
            public_id: "productos/corsair-vengeance-rgb-rgb"
          }
        ],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id, // Monitores
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung Odyssey G7 32\" 4K",
        descripcion: "Monitor gaming 32 pulgadas 4K UHD con 144Hz, 1ms, HDR600 y curvatura 1000R. Perfecto para gaming competitivo.",
        sku: "SAM-G7-32-4K",
        precio: 800.00,
        stock: 8,
        imagen_principal: {
          url: "https://res.cloudinary.com/demo/image/upload/v1234567921/samsung-odyssey-g7.jpg",
          public_id: "productos/samsung-odyssey-g7"
        },
        galeria_imagenes: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567922/samsung-odyssey-g7-front.jpg",
            public_id: "productos/samsung-odyssey-g7-front"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567923/samsung-odyssey-g7-back.jpg",
            public_id: "productos/samsung-odyssey-g7-back"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567924/samsung-odyssey-g7-gaming.jpg",
            public_id: "productos/samsung-odyssey-g7-gaming"
          }
        ],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id, // Laptops
        id_marca: marcasCreadas[16].id, // Dell
        id_administrador: administrador.id,
        nombre: "Dell Alienware M15 R7",
        descripcion: "Laptop gaming Alienware con Intel i7-12700H, RTX 3070 Ti, 16GB RAM, 1TB SSD. Diseño futurista con RGB.",
        sku: "DELL-ALW-M15R7",
        precio: 1800.00,
        stock: 5,
        imagen_principal: {
          url: "https://res.cloudinary.com/demo/image/upload/v1234567926/dell-alienware-m15.jpg",
          public_id: "productos/dell-alienware-m15"
        },
        galeria_imagenes: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567927/dell-alienware-m15-front.jpg",
            public_id: "productos/dell-alienware-m15-front"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567928/dell-alienware-m15-back.jpg",
            public_id: "productos/dell-alienware-m15-back"
          },
          {
            url: "https://res.cloudinary.com/demo/image/upload/v1234567929/dell-alienware-m15-keyboard.jpg",
            public_id: "productos/dell-alienware-m15-keyboard"
          }
        ],
        activo: true,
        destacado: true
      }
    ];

    await Producto.bulkCreate(productos);
    console.log('✅ Productos creados');

    console.log('🎉 ¡Base de datos poblada exitosamente!');
    console.log('📊 Resumen:');
    console.log('   - 1 Administrador creado');
    console.log('   - 8 Categorías creadas');
    console.log('   - 20 Marcas creadas');
    console.log('   - 5 Productos creados con nueva estructura de imágenes');

  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    throw error;
  }
};

// Ejecutar el reset
resetDatabase();
