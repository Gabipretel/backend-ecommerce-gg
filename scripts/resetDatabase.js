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
import { hashPassword } from "../src/utils/passwordUtils.js";

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
    const adminPassword = 'Password1*?';
    const hashedPassword = await hashPassword(adminPassword);
    const administrador = await Administrador.create({
      nombre: 'Admin',
      apellido: 'TechStore',
      email: 'admin@gmail.com',
      password: hashedPassword,
      rol: 'superadmin',
      fecha_registro: new Date(),
      activo: true
    });
    console.log('✅ Administrador creado');

    // Crear categorías
    console.log('📂 Creando categorías...');
    const categorias = [
      { id_administrador: administrador.id, nombre: 'Procesadores', descripcion: 'CPUs para computadoras', activo: true },
      { id_administrador: administrador.id, nombre: 'Placas de Video', descripcion: 'GPUs para gaming y trabajo', activo: true },
      { id_administrador: administrador.id, nombre: 'Memorias RAM', descripcion: 'Memoria de acceso aleatorio', activo: true },
      { id_administrador: administrador.id, nombre: 'Mothers', descripcion: 'Motherboards para PC', activo: true },
      { id_administrador: administrador.id, nombre: 'Fuentes', descripcion: 'PSUs para alimentar componentes', activo: true },
      { id_administrador: administrador.id, nombre: 'Gabinetes', descripcion: 'Cases para PC', activo: true },
      { id_administrador: administrador.id, nombre: 'Monitores', descripcion: 'Pantallas para computadoras', activo: true },
      { id_administrador: administrador.id, nombre: 'Notebooks', descripcion: 'Computadoras portátiles', activo: true }
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
      // PROCESADORES (15 productos)
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i9-13900K",
        descripcion: "Procesador Intel de 13va generación con 24 núcleos (8P+16E) y 32 hilos. Base 3.0GHz, Boost 5.8GHz. Socket LGA1700.",
        sku: "INT-I9-13900K",
        precio: 589.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i9-13900k" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i7-13700K",
        descripcion: "Procesador Intel de 13va generación con 16 núcleos (8P+8E) y 24 hilos. Base 3.4GHz, Boost 5.4GHz. Socket LGA1700.",
        sku: "INT-I7-13700K",
        precio: 409.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i7-13700k" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i5-13600K",
        descripcion: "Procesador Intel de 13va generación con 14 núcleos (6P+8E) y 20 hilos. Base 3.5GHz, Boost 5.1GHz. Socket LGA1700.",
        sku: "INT-I5-13600K",
        precio: 319.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i5-13600k" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 9 7950X",
        descripcion: "Procesador AMD Ryzen 9 con 16 núcleos y 32 hilos. Base 4.5GHz, Boost 5.7GHz. Socket AM5.",
        sku: "AMD-R9-7950X",
        precio: 699.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r9-7950x" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 7 7800X3D",
        descripcion: "Procesador AMD Ryzen 7 con tecnología 3D V-Cache. 8 núcleos, 16 hilos. Base 4.2GHz, Boost 5.0GHz. Socket AM5.",
        sku: "AMD-R7-7800X3D",
        precio: 449.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r7-7800x3d" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 5 7600X",
        descripcion: "Procesador AMD Ryzen 5 con 6 núcleos y 12 hilos. Base 4.7GHz, Boost 5.3GHz. Socket AM5.",
        sku: "AMD-R5-7600X",
        precio: 299.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r5-7600x" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i3-13100",
        descripcion: "Procesador Intel de 13va generación con 4 núcleos y 8 hilos. Base 3.4GHz, Boost 4.5GHz. Socket LGA1700.",
        sku: "INT-I3-13100",
        precio: 134.99,
        stock: 30,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i3-13100" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 3 4300G",
        descripcion: "Procesador AMD Ryzen 3 con gráficos integrados. 4 núcleos, 8 hilos. Base 3.8GHz, Boost 4.0GHz. Socket AM4.",
        sku: "AMD-R3-4300G",
        precio: 99.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r3-4300g" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i7-12700F",
        descripcion: "Procesador Intel de 12va generación sin gráficos integrados. 12 núcleos (8P+4E), 20 hilos. Socket LGA1700.",
        sku: "INT-I7-12700F",
        precio: 312.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i7-12700f" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 5 5600X",
        descripcion: "Procesador AMD Ryzen 5 de arquitectura Zen 3. 6 núcleos, 12 hilos. Base 3.7GHz, Boost 4.6GHz. Socket AM4.",
        sku: "AMD-R5-5600X",
        precio: 199.99,
        stock: 28,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r5-5600x" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i5-12400F",
        descripcion: "Procesador Intel de 12va generación sin gráficos integrados. 6 núcleos, 12 hilos. Socket LGA1700.",
        sku: "INT-I5-12400F",
        precio: 159.99,
        stock: 32,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i5-12400f" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 7 5800X3D",
        descripcion: "Procesador AMD Ryzen 7 con tecnología 3D V-Cache. 8 núcleos, 16 hilos. Base 3.4GHz, Boost 4.5GHz. Socket AM4.",
        sku: "AMD-R7-5800X3D",
        precio: 329.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r7-5800x3d" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i9-12900K",
        descripcion: "Procesador Intel de 12va generación con 16 núcleos (8P+8E) y 24 hilos. Base 3.2GHz, Boost 5.2GHz. Socket LGA1700.",
        sku: "INT-I9-12900K",
        precio: 479.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i9-12900k" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "AMD Ryzen 9 5950X",
        descripcion: "Procesador AMD Ryzen 9 de arquitectura Zen 3. 16 núcleos, 32 hilos. Base 3.4GHz, Boost 4.9GHz. Socket AM4.",
        sku: "AMD-R9-5950X",
        precio: 549.99,
        stock: 7,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/amd-r9-5950x" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[0].id,
        id_marca: marcasCreadas[0].id, // Intel
        id_administrador: administrador.id,
        nombre: "Intel Core i5-13400F",
        descripcion: "Procesador Intel de 13va generación sin gráficos integrados. 10 núcleos (6P+4E), 16 hilos. Socket LGA1700.",
        sku: "INT-I5-13400F",
        precio: 199.99,
        stock: 24,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/intel-i5-13400f" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },

      // PLACAS DE VIDEO (16 productos)
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "ASUS RTX 4090 ROG Strix",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4090 con 24GB GDDR6X. La más potente para gaming 4K y trabajo profesional.",
        sku: "ASUS-RTX4090-ROG",
        precio: 1599.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-rtx-4090-rog" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "MSI RTX 4080 Gaming X Trio",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4080 con 16GB GDDR6X. Excelente para gaming 4K y creación de contenido.",
        sku: "MSI-RTX4080-TRIO",
        precio: 1199.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-rtx-4080-trio" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "Gigabyte RTX 4070 Ti Gaming OC",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4070 Ti con 12GB GDDR6X. Ideal para gaming 1440p y 4K.",
        sku: "GB-RTX4070TI-OC",
        precio: 799.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-rtx-4070ti-oc" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "EVGA RTX 4070 FTW3 Ultra",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4070 con 12GB GDDR6X. Perfecta para gaming 1440p de alta calidad.",
        sku: "EVGA-RTX4070-FTW3",
        precio: 599.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-rtx-4070-ftw3" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "Sapphire RX 7900 XTX Nitro+",
        descripcion: "Tarjeta gráfica AMD RX 7900 XTX con 24GB GDDR6. Competencia directa a RTX 4080.",
        sku: "SAP-RX7900XTX-NITRO",
        precio: 999.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/sap-rx7900xtx-nitro" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "PowerColor RX 7900 XT Red Devil",
        descripcion: "Tarjeta gráfica AMD RX 7900 XT con 20GB GDDR6. Excelente relación precio-rendimiento.",
        sku: "PC-RX7900XT-RD",
        precio: 749.99,
        stock: 14,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/pc-rx7900xt-rd" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "Zotac RTX 4060 Ti Twin Edge",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4060 Ti con 16GB GDDR6. Ideal para gaming 1080p y 1440p.",
        sku: "ZT-RTX4060TI-TWIN",
        precio: 449.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/zt-rtx4060ti-twin" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "ASRock RX 7800 XT Phantom Gaming",
        descripcion: "Tarjeta gráfica AMD RX 7800 XT con 16GB GDDR6. Perfecta para gaming 1440p de alta calidad.",
        sku: "ASR-RX7800XT-PG",
        precio: 499.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asr-rx7800xt-pg" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "PNY RTX 4060 Verto Dual Fan",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4060 con 8GB GDDR6. Excelente para gaming 1080p.",
        sku: "PNY-RTX4060-VERTO",
        precio: 299.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/pny-rtx4060-verto" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "XFX RX 7700 XT Speedster MERC",
        descripcion: "Tarjeta gráfica AMD RX 7700 XT con 12GB GDDR6. Ideal para gaming 1440p.",
        sku: "XFX-RX7700XT-MERC",
        precio: 419.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/xfx-rx7700xt-merc" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "Palit RTX 3060 Ti Dual",
        descripcion: "Tarjeta gráfica NVIDIA RTX 3060 Ti con 8GB GDDR6. Excelente opción para gaming 1440p.",
        sku: "PAL-RTX3060TI-DUAL",
        precio: 379.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/pal-rtx3060ti-dual" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "Gigabyte RX 6700 XT Gaming OC",
        descripcion: "Tarjeta gráfica AMD RX 6700 XT con 12GB GDDR6. Buena opción para gaming 1440p.",
        sku: "GB-RX6700XT-OC",
        precio: 349.99,
        stock: 19,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-rx6700xt-oc" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "ASUS RTX 3070 TUF Gaming",
        descripcion: "Tarjeta gráfica NVIDIA RTX 3070 con 8GB GDDR6. Sólida opción para gaming 1440p.",
        sku: "ASUS-RTX3070-TUF",
        precio: 499.99,
        stock: 13,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-rtx3070-tuf" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "MSI RTX 3060 Ventus 2X",
        descripcion: "Tarjeta gráfica NVIDIA RTX 3060 con 12GB GDDR6. Perfecta para gaming 1080p de alta calidad.",
        sku: "MSI-RTX3060-VENTUS",
        precio: 329.99,
        stock: 28,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-rtx3060-ventus" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[1].id, // AMD
        id_administrador: administrador.id,
        nombre: "Sapphire RX 6600 Pulse",
        descripcion: "Tarjeta gráfica AMD RX 6600 con 8GB GDDR6. Excelente para gaming 1080p.",
        sku: "SAP-RX6600-PULSE",
        precio: 239.99,
        stock: 30,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/sap-rx6600-pulse" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[1].id,
        id_marca: marcasCreadas[2].id, // NVIDIA
        id_administrador: administrador.id,
        nombre: "Gainward RTX 4050 Ghost",
        descripcion: "Tarjeta gráfica NVIDIA RTX 4050 con 6GB GDDR6. Entrada al gaming con ray tracing.",
        sku: "GW-RTX4050-GHOST",
        precio: 199.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gw-rtx4050-ghost" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },

      // MEMORIAS RAM (17 productos)
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Dominator Platinum RGB 64GB",
        descripcion: "Kit de memoria DDR5 64GB (2x32GB) 5600MHz con iluminación RGB premium. Para workstations y gaming extremo.",
        sku: "COR-DOM-RGB-64GB",
        precio: 599.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-dominator-64gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[7].id, // G.Skill
        id_administrador: administrador.id,
        nombre: "G.Skill Trident Z5 RGB 32GB",
        descripcion: "Kit de memoria DDR5 32GB (2x16GB) 6000MHz con iluminación RGB. Optimizada para Intel 12va/13va gen.",
        sku: "GS-TZ5-RGB-32GB",
        precio: 289.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gskill-trident-z5-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[8].id, // Kingston
        id_administrador: administrador.id,
        nombre: "Kingston Fury Beast 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3200MHz. Excelente relación precio-rendimiento para gaming.",
        sku: "KG-FURY-32GB",
        precio: 119.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/kingston-fury-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Vengeance LPX 16GB",
        descripcion: "Kit de memoria DDR4 16GB (2x8GB) 3200MHz. Perfil bajo, ideal para sistemas compactos.",
        sku: "COR-VEN-LPX-16GB",
        precio: 59.99,
        stock: 40,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-vengeance-lpx-16gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[7].id, // G.Skill
        id_administrador: administrador.id,
        nombre: "G.Skill Ripjaws V 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3600MHz. Excelente para gaming y productividad.",
        sku: "GS-RIP-V-32GB",
        precio: 139.99,
        stock: 30,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gskill-ripjaws-v-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[8].id, // Kingston
        id_administrador: administrador.id,
        nombre: "Kingston Fury Renegade 16GB",
        descripcion: "Kit de memoria DDR4 16GB (2x8GB) 3600MHz con disipadores de calor. Para gaming de alta performance.",
        sku: "KG-FURY-REN-16GB",
        precio: 89.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/kingston-fury-renegade-16gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Vengeance RGB Pro 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3200MHz con iluminación RGB. Compatible con iCUE.",
        sku: "COR-VEN-RGB-PRO-32GB",
        precio: 159.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-vengeance-rgb-pro-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[7].id, // G.Skill
        id_administrador: administrador.id,
        nombre: "G.Skill Trident Z Neo 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3600MHz optimizada para AMD Ryzen con RGB.",
        sku: "GS-TZ-NEO-32GB",
        precio: 179.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gskill-trident-z-neo-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[8].id, // Kingston
        id_administrador: administrador.id,
        nombre: "Kingston ValueRAM 8GB",
        descripcion: "Memoria DDR4 8GB 2666MHz. Solución económica para uso básico y oficina.",
        sku: "KG-VALUE-8GB",
        precio: 29.99,
        stock: 50,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/kingston-valueram-8gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Vengeance DDR5 32GB",
        descripcion: "Kit de memoria DDR5 32GB (2x16GB) 5200MHz. Nueva generación para plataformas modernas.",
        sku: "COR-VEN-DDR5-32GB",
        precio: 249.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-vengeance-ddr5-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[7].id, // G.Skill
        id_administrador: administrador.id,
        nombre: "G.Skill Flare X5 32GB",
        descripcion: "Kit de memoria DDR5 32GB (2x16GB) 5600MHz optimizada para AMD Ryzen 7000.",
        sku: "GS-FLARE-X5-32GB",
        precio: 269.99,
        stock: 14,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gskill-flare-x5-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[8].id, // Kingston
        id_administrador: administrador.id,
        nombre: "Kingston Fury Beast DDR5 16GB",
        descripcion: "Kit de memoria DDR5 16GB (2x8GB) 4800MHz. Entrada a la nueva generación DDR5.",
        sku: "KG-FURY-DDR5-16GB",
        precio: 129.99,
        stock: 28,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/kingston-fury-ddr5-16gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Vengeance LPX 64GB",
        descripcion: "Kit de memoria DDR4 64GB (4x16GB) 3200MHz. Para workstations y servidores.",
        sku: "COR-VEN-LPX-64GB",
        precio: 299.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-vengeance-lpx-64gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[7].id, // G.Skill
        id_administrador: administrador.id,
        nombre: "G.Skill Aegis 16GB",
        descripcion: "Kit de memoria DDR4 16GB (2x8GB) 3000MHz. Solución económica sin RGB.",
        sku: "GS-AEGIS-16GB",
        precio: 54.99,
        stock: 45,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gskill-aegis-16gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[8].id, // Kingston
        id_administrador: administrador.id,
        nombre: "Kingston HyperX Predator 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3600MHz con disipadores agresivos. Para overclocking.",
        sku: "KG-HX-PRED-32GB",
        precio: 189.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/kingston-hyperx-predator-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair Vengeance RGB RT 16GB",
        descripcion: "Kit de memoria DDR4 16GB (2x8GB) 3200MHz con RGB dinámico y perfil bajo.",
        sku: "COR-VEN-RGB-RT-16GB",
        precio: 79.99,
        stock: 32,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-vengeance-rgb-rt-16gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[2].id,
        id_marca: marcasCreadas[7].id, // G.Skill
        id_administrador: administrador.id,
        nombre: "G.Skill Trident Z Royal 32GB",
        descripcion: "Kit de memoria DDR4 32GB (2x16GB) 3600MHz con cristales y RGB premium. Edición de lujo.",
        sku: "GS-TZ-ROYAL-32GB",
        precio: 229.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gskill-trident-z-royal-32gb" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },

      // MOTHERS (18 productos)
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[3].id, // ASUS
        id_administrador: administrador.id,
        nombre: "ASUS ROG Maximus Z790 Hero",
        descripcion: "Motherboard Z790 para Intel 12va/13va gen. WiFi 6E, DDR5, PCIe 5.0, RGB Aura Sync. Para gaming extremo.",
        sku: "ASUS-Z790-HERO",
        precio: 629.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-z790-hero" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[4].id, // MSI
        id_administrador: administrador.id,
        nombre: "MSI MAG B660M Mortar WiFi",
        descripcion: "Motherboard B660 mATX para Intel 12va/13va gen. WiFi 6, DDR4, PCIe 4.0. Formato compacto.",
        sku: "MSI-B660M-MORTAR",
        precio: 179.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-b660m-mortar" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[5].id, // Gigabyte
        id_administrador: administrador.id,
        nombre: "Gigabyte X670E Aorus Master",
        descripcion: "Motherboard X670E para AMD Ryzen 7000. WiFi 6E, DDR5, PCIe 5.0, RGB Fusion. Premium para AMD.",
        sku: "GB-X670E-MASTER",
        precio: 499.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-x670e-master" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[3].id, // ASUS
        id_administrador: administrador.id,
        nombre: "ASUS Prime B550M-A WiFi",
        descripcion: "Motherboard B550 mATX para AMD Ryzen 3000/5000. WiFi 6, DDR4, PCIe 4.0. Económica y confiable.",
        sku: "ASUS-B550M-A",
        precio: 129.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-b550m-a" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[4].id, // MSI
        id_administrador: administrador.id,
        nombre: "MSI MPG Z690 Carbon WiFi",
        descripcion: "Motherboard Z690 para Intel 12va/13va gen. WiFi 6E, DDR5/DDR4, PCIe 5.0, RGB Mystic Light.",
        sku: "MSI-Z690-CARBON",
        precio: 379.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-z690-carbon" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[5].id, // Gigabyte
        id_administrador: administrador.id,
        nombre: "Gigabyte B450M DS3H",
        descripcion: "Motherboard B450 mATX para AMD Ryzen 1000/2000/3000. DDR4, PCIe 3.0. Entrada económica.",
        sku: "GB-B450M-DS3H",
        precio: 69.99,
        stock: 45,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-b450m-ds3h" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[3].id, // ASUS
        id_administrador: administrador.id,
        nombre: "ASUS TUF Gaming X570-Plus",
        descripcion: "Motherboard X570 para AMD Ryzen 2000/3000/5000. WiFi 6, DDR4, PCIe 4.0. Durabilidad militar.",
        sku: "ASUS-X570-PLUS",
        precio: 189.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-x570-plus" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[4].id, // MSI
        id_administrador: administrador.id,
        nombre: "MSI Pro B660M-A WiFi",
        descripcion: "Motherboard B660 mATX para Intel 12va/13va gen. WiFi 6, DDR4, PCIe 4.0. Para oficina y productividad.",
        sku: "MSI-B660M-A",
        precio: 139.99,
        stock: 30,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-b660m-a" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[5].id, // Gigabyte
        id_administrador: administrador.id,
        nombre: "Gigabyte Z690 Aorus Elite AX",
        descripcion: "Motherboard Z690 para Intel 12va/13va gen. WiFi 6E, DDR5/DDR4, PCIe 5.0, RGB Fusion.",
        sku: "GB-Z690-ELITE",
        precio: 299.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-z690-elite" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[3].id, // ASUS
        id_administrador: administrador.id,
        nombre: "ASUS ROG Strix B550-F Gaming",
        descripcion: "Motherboard B550 para AMD Ryzen 3000/5000. WiFi 6, DDR4, PCIe 4.0, RGB Aura Sync. Gaming premium.",
        sku: "ASUS-B550F-GAMING",
        precio: 199.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-b550f-gaming" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[4].id, // MSI
        id_administrador: administrador.id,
        nombre: "MSI MAG X570S Tomahawk Max",
        descripcion: "Motherboard X570S para AMD Ryzen 2000/3000/5000. WiFi 6, DDR4, PCIe 4.0. Sin ventilador chipset.",
        sku: "MSI-X570S-TOMAHAWK",
        precio: 219.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-x570s-tomahawk" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[5].id, // Gigabyte
        id_administrador: administrador.id,
        nombre: "Gigabyte B550M Aorus Pro-P",
        descripcion: "Motherboard B550 mATX para AMD Ryzen 3000/5000. DDR4, PCIe 4.0. Formato compacto con características premium.",
        sku: "GB-B550M-AORUS",
        precio: 149.99,
        stock: 28,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-b550m-aorus" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[3].id, // ASUS
        id_administrador: administrador.id,
        nombre: "ASUS Prime H610M-E D4",
        descripcion: "Motherboard H610 mATX para Intel 12va/13va gen. DDR4, PCIe 4.0. Económica para uso básico.",
        sku: "ASUS-H610M-E",
        precio: 79.99,
        stock: 40,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-h610m-e" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[4].id, // MSI
        id_administrador: administrador.id,
        nombre: "MSI MEG Z790 Ace",
        descripcion: "Motherboard Z790 premium para Intel 12va/13va gen. WiFi 6E, DDR5, PCIe 5.0, overclocking extremo.",
        sku: "MSI-Z790-ACE",
        precio: 699.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-z790-ace" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[5].id, // Gigabyte
        id_administrador: administrador.id,
        nombre: "Gigabyte A520M S2H",
        descripcion: "Motherboard A520 mATX para AMD Ryzen 3000/4000/5000. DDR4, PCIe 3.0. Solución ultra económica.",
        sku: "GB-A520M-S2H",
        precio: 59.99,
        stock: 50,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-a520m-s2h" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[3].id, // ASUS
        id_administrador: administrador.id,
        nombre: "ASUS ROG Crosshair X670E Hero",
        descripcion: "Motherboard X670E premium para AMD Ryzen 7000. WiFi 6E, DDR5, PCIe 5.0, overclocking avanzado.",
        sku: "ASUS-X670E-HERO",
        precio: 649.99,
        stock: 6,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/asus-x670e-hero" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[4].id, // MSI
        id_administrador: administrador.id,
        nombre: "MSI B550M Pro-VDH WiFi",
        descripcion: "Motherboard B550 mATX para AMD Ryzen 3000/5000. WiFi 6, DDR4, PCIe 4.0. Excelente relación precio-valor.",
        sku: "MSI-B550M-VDH",
        precio: 109.99,
        stock: 32,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/msi-b550m-vdh" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[3].id,
        id_marca: marcasCreadas[5].id, // Gigabyte
        id_administrador: administrador.id,
        nombre: "Gigabyte Z790 Aorus Xtreme",
        descripcion: "Motherboard Z790 ultra premium para Intel 12va/13va gen. WiFi 6E, DDR5, PCIe 5.0, 10GbE LAN.",
        sku: "GB-Z790-XTREME",
        precio: 899.99,
        stock: 3,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/gb-z790-xtreme" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },

      // FUENTES (16 productos)
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[9].id, // EVGA
        id_administrador: administrador.id,
        nombre: "EVGA SuperNOVA 1000 G6",
        descripcion: "Fuente modular 1000W 80+ Gold. Completamente modular, ventilador de 135mm, garantía 10 años.",
        sku: "EVGA-1000-G6",
        precio: 179.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-1000-g6" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[10].id, // Seasonic
        id_administrador: administrador.id,
        nombre: "Seasonic Focus GX-850",
        descripcion: "Fuente modular 850W 80+ Gold. Híbrida semi-pasiva, cables modulares, garantía 10 años.",
        sku: "SEA-GX-850",
        precio: 149.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/seasonic-gx-850" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair RM750x",
        descripcion: "Fuente modular 750W 80+ Gold. Completamente modular, ventilador magnético, garantía 10 años.",
        sku: "COR-RM750X",
        precio: 129.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-rm750x" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[9].id, // EVGA
        id_administrador: administrador.id,
        nombre: "EVGA BR 600W",
        descripcion: "Fuente no modular 600W 80+ Bronze. Económica y confiable para sistemas básicos.",
        sku: "EVGA-BR-600",
        precio: 59.99,
        stock: 40,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-br-600" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[10].id, // Seasonic
        id_administrador: administrador.id,
        nombre: "Seasonic Prime TX-1000",
        descripcion: "Fuente modular 1000W 80+ Titanium. Máxima eficiencia, completamente modular, garantía 12 años.",
        sku: "SEA-TX-1000",
        precio: 299.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/seasonic-tx-1000" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair CV650",
        descripcion: "Fuente no modular 650W 80+ Bronze. Confiable para sistemas de gama media.",
        sku: "COR-CV650",
        precio: 69.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-cv650" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[9].id, // EVGA
        id_administrador: administrador.id,
        nombre: "EVGA SuperNOVA 650 G5",
        descripcion: "Fuente modular 650W 80+ Gold. Completamente modular, ventilador de 135mm, garantía 10 años.",
        sku: "EVGA-650-G5",
        precio: 99.99,
        stock: 28,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-650-g5" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[10].id, // Seasonic
        id_administrador: administrador.id,
        nombre: "Seasonic Core GM-500",
        descripcion: "Fuente semi-modular 500W 80+ Gold. Compacta y eficiente para sistemas ITX.",
        sku: "SEA-GM-500",
        precio: 79.99,
        stock: 32,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/seasonic-gm-500" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair HX1200",
        descripcion: "Fuente modular 1200W 80+ Platinum. Para sistemas de alta gama, completamente modular.",
        sku: "COR-HX1200",
        precio: 249.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-hx1200" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[9].id, // EVGA
        id_administrador: administrador.id,
        nombre: "EVGA W3 450W",
        descripcion: "Fuente no modular 450W 80+ White. Económica para sistemas básicos de oficina.",
        sku: "EVGA-W3-450",
        precio: 39.99,
        stock: 50,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-w3-450" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[10].id, // Seasonic
        id_administrador: administrador.id,
        nombre: "Seasonic Focus Plus 750W",
        descripcion: "Fuente modular 750W 80+ Platinum. Alta eficiencia, completamente modular.",
        sku: "SEA-PLUS-750",
        precio: 139.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/seasonic-plus-750" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair SF750",
        descripcion: "Fuente SFX modular 750W 80+ Platinum. Compacta para sistemas ITX de alta gama.",
        sku: "COR-SF750",
        precio: 189.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-sf750" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[9].id, // EVGA
        id_administrador: administrador.id,
        nombre: "EVGA SuperNOVA 850 GA",
        descripcion: "Fuente modular 850W 80+ Gold. Completamente modular, ventilador ECO, garantía 10 años.",
        sku: "EVGA-850-GA",
        precio: 119.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-850-ga" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[10].id, // Seasonic
        id_administrador: administrador.id,
        nombre: "Seasonic Focus SGX-650",
        descripcion: "Fuente SFX-L modular 650W 80+ Gold. Para sistemas compactos de alta performance.",
        sku: "SEA-SGX-650",
        precio: 159.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/seasonic-sgx-650" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair RM850x",
        descripcion: "Fuente modular 850W 80+ Gold. Completamente modular, ventilador magnético, garantía 10 años.",
        sku: "COR-RM850X",
        precio: 149.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-rm850x" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[4].id,
        id_marca: marcasCreadas[9].id, // EVGA
        id_administrador: administrador.id,
        nombre: "EVGA SuperNOVA 1600 P2",
        descripcion: "Fuente modular 1600W 80+ Platinum. Para sistemas extremos con múltiples GPUs.",
        sku: "EVGA-1600-P2",
        precio: 399.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/evga-1600-p2" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },

      // GABINETES (17 productos)
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[11].id, // NZXT
        id_administrador: administrador.id,
        nombre: "NZXT H7 Flow",
        descripcion: "Gabinete ATX con panel frontal mesh. Excelente flujo de aire, cristal templado, RGB integrado.",
        sku: "NZXT-H7-FLOW",
        precio: 149.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/nzxt-h7-flow" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[12].id, // Cooler Master
        id_administrador: administrador.id,
        nombre: "Cooler Master MasterBox TD500 Mesh",
        descripcion: "Gabinete ATX con panel mesh frontal. 3 ventiladores ARGB incluidos, cristal templado.",
        sku: "CM-TD500-MESH",
        precio: 99.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/cm-td500-mesh" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair 4000D Airflow",
        descripcion: "Gabinete ATX con panel frontal perforado. Optimizado para flujo de aire, cristal templado.",
        sku: "COR-4000D-AF",
        precio: 104.99,
        stock: 30,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-4000d-af" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[11].id, // NZXT
        id_administrador: administrador.id,
        nombre: "NZXT H1 Elite",
        descripcion: "Gabinete ITX vertical con AIO y fuente incluidos. Diseño compacto y elegante.",
        sku: "NZXT-H1-ELITE",
        precio: 399.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/nzxt-h1-elite" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[12].id, // Cooler Master
        id_administrador: administrador.id,
        nombre: "Cooler Master HAF 700 EVO",
        descripcion: "Gabinete Full Tower con soporte para E-ATX. Máximo espacio para componentes extremos.",
        sku: "CM-HAF-700-EVO",
        precio: 499.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/cm-haf-700-evo" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair 2000D RGB Airflow",
        descripcion: "Gabinete mATX compacto con RGB. Panel frontal mesh, cristal templado, ventiladores RGB.",
        sku: "COR-2000D-RGB",
        precio: 89.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-2000d-rgb" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[11].id, // NZXT
        id_administrador: administrador.id,
        nombre: "NZXT H5 Flow",
        descripcion: "Gabinete mATX con panel frontal mesh. Compacto pero con excelente flujo de aire.",
        sku: "NZXT-H5-FLOW",
        precio: 89.99,
        stock: 28,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/nzxt-h5-flow" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[12].id, // Cooler Master
        id_administrador: administrador.id,
        nombre: "Cooler Master NR200P",
        descripcion: "Gabinete ITX con panel de cristal templado. Soporte para GPU de tamaño completo.",
        sku: "CM-NR200P",
        precio: 109.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/cm-nr200p" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair 7000D Airflow",
        descripcion: "Gabinete Full Tower con panel frontal perforado. Máximo espacio y flujo de aire.",
        sku: "COR-7000D-AF",
        precio: 249.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-7000d-af" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[11].id, // NZXT
        id_administrador: administrador.id,
        nombre: "NZXT H6 Flow",
        descripcion: "Gabinete ATX con panel frontal mesh. Diseño limpio con excelente ventilación.",
        sku: "NZXT-H6-FLOW",
        precio: 119.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/nzxt-h6-flow" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[12].id, // Cooler Master
        id_administrador: administrador.id,
        nombre: "Cooler Master MasterBox Q300L",
        descripcion: "Gabinete mITX ultra compacto. Económico y funcional para builds básicos.",
        sku: "CM-Q300L",
        precio: 44.99,
        stock: 45,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/cm-q300l" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair 5000D Airflow",
        descripcion: "Gabinete ATX con panel frontal perforado. Excelente balance entre espacio y flujo de aire.",
        sku: "COR-5000D-AF",
        precio: 164.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-5000d-af" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[11].id, // NZXT
        id_administrador: administrador.id,
        nombre: "NZXT H9 Flow",
        descripcion: "Gabinete ATX premium con panel frontal mesh. Diseño moderno con RGB integrado.",
        sku: "NZXT-H9-FLOW",
        precio: 199.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/nzxt-h9-flow" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[12].id, // Cooler Master
        id_administrador: administrador.id,
        nombre: "Cooler Master Silencio S400",
        descripcion: "Gabinete ATX silencioso con paneles insonorizados. Para sistemas silenciosos.",
        sku: "CM-S400",
        precio: 79.99,
        stock: 24,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/cm-s400" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[6].id, // Corsair
        id_administrador: administrador.id,
        nombre: "Corsair 3000D Airflow",
        descripcion: "Gabinete ATX compacto con panel frontal perforado. Ideal para builds de gama media.",
        sku: "COR-3000D-AF",
        precio: 79.99,
        stock: 32,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/corsair-3000d-af" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[11].id, // NZXT
        id_administrador: administrador.id,
        nombre: "NZXT H7 Elite",
        descripcion: "Gabinete ATX premium con Smart Device V2. RGB avanzado y control de ventiladores.",
        sku: "NZXT-H7-ELITE",
        precio: 229.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/nzxt-h7-elite" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[5].id,
        id_marca: marcasCreadas[12].id, // Cooler Master
        id_administrador: administrador.id,
        nombre: "Cooler Master MasterCase H500M",
        descripcion: "Gabinete ATX con paneles mesh frontales y superiores. 2 ventiladores RGB de 200mm.",
        sku: "CM-H500M",
        precio: 199.99,
        stock: 14,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/cm-h500m" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },

      // MONITORES (18 productos)
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung Odyssey G9 49\" 5120x1440",
        descripcion: "Monitor ultrawide curvo 49 pulgadas DQHD 240Hz. G-Sync Compatible, HDR1000, curvatura 1000R.",
        sku: "SAM-G9-49-DQHD",
        precio: 1299.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/samsung-g9-49" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[14].id, // LG
        id_administrador: administrador.id,
        nombre: "LG UltraGear 27GP850-B 27\" 1440p",
        descripcion: "Monitor gaming 27 pulgadas QHD 165Hz. Nano IPS, G-Sync Compatible, HDR400, 1ms.",
        sku: "LG-27GP850-B",
        precio: 399.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lg-27gp850-b" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[15].id, // Acer
        id_administrador: administrador.id,
        nombre: "Acer Predator X27 27\" 4K 144Hz",
        descripcion: "Monitor gaming 27 pulgadas 4K UHD 144Hz. IPS, G-Sync Ultimate, HDR1000, quantum dot.",
        sku: "ACER-X27-4K-144",
        precio: 1799.99,
        stock: 3,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/acer-x27-4k" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung M7 32\" 4K Smart Monitor",
        descripcion: "Monitor inteligente 32 pulgadas 4K UHD. Smart TV integrado, USB-C, AirPlay, DeX.",
        sku: "SAM-M7-32-4K",
        precio: 499.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/samsung-m7-32" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[14].id, // LG
        id_administrador: administrador.id,
        nombre: "LG 27UP850-W 27\" 4K USB-C",
        descripcion: "Monitor profesional 27 pulgadas 4K UHD. IPS, USB-C 96W, HDR400, calibración de color.",
        sku: "LG-27UP850-W",
        precio: 449.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lg-27up850-w" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[15].id, // Acer
        id_administrador: administrador.id,
        nombre: "Acer Nitro XV272U 27\" 1440p 170Hz",
        descripcion: "Monitor gaming 27 pulgadas QHD 170Hz. IPS, FreeSync Premium, HDR400, 1ms.",
        sku: "ACER-XV272U-170",
        precio: 299.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/acer-xv272u-170" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung Odyssey G7 32\" 1440p 240Hz",
        descripcion: "Monitor gaming curvo 32 pulgadas QHD 240Hz. QLED, G-Sync Compatible, HDR600, curvatura 1000R.",
        sku: "SAM-G7-32-240",
        precio: 699.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/samsung-g7-32-240" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[14].id, // LG
        id_administrador: administrador.id,
        nombre: "LG 24GN600-B 24\" 1080p 144Hz",
        descripcion: "Monitor gaming 24 pulgadas Full HD 144Hz. IPS, FreeSync Premium, HDR10, 1ms.",
        sku: "LG-24GN600-B",
        precio: 179.99,
        stock: 30,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lg-24gn600-b" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[15].id, // Acer
        id_administrador: administrador.id,
        nombre: "Acer SB220Q 21.5\" 1080p IPS",
        descripcion: "Monitor básico 21.5 pulgadas Full HD. IPS, 75Hz, FreeSync, HDMI/VGA. Ideal para oficina.",
        sku: "ACER-SB220Q-IPS",
        precio: 89.99,
        stock: 45,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/acer-sb220q-ips" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung CF398 27\" 1080p Curvo",
        descripcion: "Monitor curvo 27 pulgadas Full HD. VA, curvatura 1800R, FreeSync, Eye Saver Mode.",
        sku: "SAM-CF398-27-CURVO",
        precio: 199.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/samsung-cf398-27" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[14].id, // LG
        id_administrador: administrador.id,
        nombre: "LG 34WP65C-B 34\" Ultrawide 1440p",
        descripcion: "Monitor ultrawide curvo 34 pulgadas UWQHD. IPS, USB-C, HDR10, curvatura 1800R.",
        sku: "LG-34WP65C-B",
        precio: 399.99,
        stock: 14,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lg-34wp65c-b" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[15].id, // Acer
        id_administrador: administrador.id,
        nombre: "Acer Predator XB253Q 24.5\" 1080p 360Hz",
        descripcion: "Monitor gaming competitivo 24.5 pulgadas Full HD 360Hz. IPS, G-Sync, ULMB, 0.5ms.",
        sku: "ACER-XB253Q-360",
        precio: 599.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/acer-xb253q-360" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung UR59C 32\" 4K Curvo",
        descripcion: "Monitor curvo 32 pulgadas 4K UHD. VA, curvatura 1500R, FreeSync, Picture-by-Picture.",
        sku: "SAM-UR59C-32-4K",
        precio: 349.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/samsung-ur59c-32" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[14].id, // LG
        id_administrador: administrador.id,
        nombre: "LG 27UL500-W 27\" 4K IPS",
        descripcion: "Monitor 27 pulgadas 4K UHD. IPS, HDR10, FreeSync, sRGB 98%, HDMI/DisplayPort.",
        sku: "LG-27UL500-W",
        precio: 299.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lg-27ul500-w" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[15].id, // Acer
        id_administrador: administrador.id,
        nombre: "Acer ET322QK 32\" 4K VA",
        descripcion: "Monitor 32 pulgadas 4K UHD. VA, FreeSync, HDR10, 4ms, HDMI/DisplayPort.",
        sku: "ACER-ET322QK-4K",
        precio: 279.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/acer-et322qk-4k" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[13].id, // Samsung
        id_administrador: administrador.id,
        nombre: "Samsung Odyssey G5 27\" 1440p 144Hz",
        descripcion: "Monitor gaming curvo 27 pulgadas QHD 144Hz. VA, G-Sync Compatible, HDR10, curvatura 1000R.",
        sku: "SAM-G5-27-144",
        precio: 329.99,
        stock: 24,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/samsung-g5-27-144" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[14].id, // LG
        id_administrador: administrador.id,
        nombre: "LG 22MK430H-B 22\" 1080p IPS",
        descripcion: "Monitor básico 22 pulgadas Full HD. IPS, 75Hz, FreeSync, HDMI/VGA. Económico y confiable.",
        sku: "LG-22MK430H-B",
        precio: 99.99,
        stock: 40,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lg-22mk430h-b" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[6].id,
        id_marca: marcasCreadas[15].id, // Acer
        id_administrador: administrador.id,
        nombre: "Acer Predator X34GS 34\" Ultrawide 180Hz",
        descripcion: "Monitor ultrawide curvo 34 pulgadas UWQHD 180Hz. IPS, G-Sync Ultimate, HDR400, curvatura 1900R.",
        sku: "ACER-X34GS-180",
        precio: 999.99,
        stock: 6,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/acer-x34gs-180" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },

      // NOTEBOOKS (19 productos)
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[16].id, // Dell
        id_administrador: administrador.id,
        nombre: "Dell Alienware m18 R1",
        descripcion: "Laptop gaming 18 pulgadas con Intel i9-13900HX, RTX 4090, 32GB RAM, 1TB SSD. La más potente.",
        sku: "DELL-ALW-M18R1",
        precio: 4299.99,
        stock: 2,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/dell-alienware-m18r1" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[17].id, // HP
        id_administrador: administrador.id,
        nombre: "HP Omen 16-wf0013dx",
        descripcion: "Laptop gaming 16 pulgadas con Intel i7-13700HX, RTX 4070, 16GB RAM, 512GB SSD. Excelente relación precio-rendimiento.",
        sku: "HP-OMEN-16-WF0013",
        precio: 1499.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/hp-omen-16-wf0013" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[18].id, // Lenovo
        id_administrador: administrador.id,
        nombre: "Lenovo Legion Pro 7i Gen 8",
        descripcion: "Laptop gaming 16 pulgadas con Intel i9-13900HX, RTX 4080, 32GB RAM, 1TB SSD. Pantalla 240Hz.",
        sku: "LEN-LEG-PRO7I-G8",
        precio: 2799.99,
        stock: 5,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lenovo-legion-pro7i" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Pro 16\" M3 Max",
        descripcion: "MacBook Pro 16 pulgadas con chip M3 Max, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR.",
        sku: "APPLE-MBP-16-M3MAX",
        precio: 3999.99,
        stock: 4,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mbp-16-m3max" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[16].id, // Dell
        id_administrador: administrador.id,
        nombre: "Dell XPS 13 Plus 9320",
        descripcion: "Ultrabook 13 pulgadas con Intel i7-1360P, 16GB RAM, 512GB SSD. Diseño premium y portabilidad.",
        sku: "DELL-XPS-13-PLUS",
        precio: 1299.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/dell-xps-13-plus" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[17].id, // HP
        id_administrador: administrador.id,
        nombre: "HP Pavilion 15-eh3001la",
        descripcion: "Laptop 15 pulgadas con AMD Ryzen 5 7530U, 8GB RAM, 256GB SSD. Ideal para uso diario.",
        sku: "HP-PAV-15-EH3001",
        precio: 649.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/hp-pavilion-15-eh3001" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[18].id, // Lenovo
        id_administrador: administrador.id,
        nombre: "Lenovo ThinkPad X1 Carbon Gen 11",
        descripcion: "Ultrabook empresarial 14 pulgadas con Intel i7-1365U, 16GB RAM, 512GB SSD. Durabilidad militar.",
        sku: "LEN-TP-X1C-G11",
        precio: 1899.99,
        stock: 10,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lenovo-thinkpad-x1c-g11" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Air 15\" M2",
        descripcion: "MacBook Air 15 pulgadas con chip M2, 8GB RAM, 256GB SSD. Ultra delgado y silencioso.",
        sku: "APPLE-MBA-15-M2",
        precio: 1299.99,
        stock: 15,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mba-15-m2" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[16].id, // Dell
        id_administrador: administrador.id,
        nombre: "Dell Inspiron 15 3520",
        descripcion: "Laptop básica 15 pulgadas con Intel i5-1235U, 8GB RAM, 256GB SSD. Económica y confiable.",
        sku: "DELL-INS-15-3520",
        precio: 549.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/dell-inspiron-15-3520" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[17].id, // HP
        id_administrador: administrador.id,
        nombre: "HP Envy x360 15-fe0013dx",
        descripcion: "Laptop convertible 15 pulgadas con Intel i7-1355U, 16GB RAM, 512GB SSD. Pantalla táctil 2-en-1.",
        sku: "HP-ENVY-X360-15",
        precio: 899.99,
        stock: 14,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/hp-envy-x360-15" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[18].id, // Lenovo
        id_administrador: administrador.id,
        nombre: "Lenovo IdeaPad Gaming 3 15ACH6",
        descripcion: "Laptop gaming económica 15 pulgadas con AMD Ryzen 5 5600H, GTX 1650, 8GB RAM, 256GB SSD.",
        sku: "LEN-IP-GAM3-15ACH6",
        precio: 699.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lenovo-ideapad-gaming3" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Air 13\" M2",
        descripcion: "MacBook Air 13 pulgadas con chip M2, 8GB RAM, 256GB SSD. Clásico y eficiente.",
        sku: "APPLE-MBA-13-M2",
        precio: 1099.99,
        stock: 22,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mba-13-m2" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[16].id, // Dell
        id_administrador: administrador.id,
        nombre: "Dell Precision 5570",
        descripcion: "Workstation móvil 15 pulgadas con Intel i7-12700H, RTX A2000, 32GB RAM, 1TB SSD. Para profesionales.",
        sku: "DELL-PREC-5570",
        precio: 2499.99,
        stock: 6,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/dell-precision-5570" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[17].id, // HP
        id_administrador: administrador.id,
        nombre: "HP 14-dq2033cl",
        descripcion: "Laptop básica 14 pulgadas con Intel i3-1115G4, 4GB RAM, 128GB SSD. Ultra económica.",
        sku: "HP-14-DQ2033CL",
        precio: 349.99,
        stock: 35,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/hp-14-dq2033cl" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[18].id, // Lenovo
        id_administrador: administrador.id,
        nombre: "Lenovo Yoga 9i 14IMH9",
        descripcion: "Ultrabook premium 14 pulgadas con Intel i7-1360P, 16GB RAM, 1TB SSD. Pantalla OLED táctil.",
        sku: "LEN-YOGA-9I-14IMH9",
        precio: 1599.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lenovo-yoga-9i-14imh9" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[16].id, // Dell
        id_administrador: administrador.id,
        nombre: "Dell G15 5530",
        descripcion: "Laptop gaming 15 pulgadas con Intel i7-13650HX, RTX 4060, 16GB RAM, 512GB SSD. Gaming accesible.",
        sku: "DELL-G15-5530",
        precio: 1199.99,
        stock: 16,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/dell-g15-5530" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[17].id, // HP
        id_administrador: administrador.id,
        nombre: "HP ZBook Studio 16 G9",
        descripcion: "Workstation móvil 16 pulgadas con Intel i9-12900H, RTX A3000, 32GB RAM, 1TB SSD. Para creadores.",
        sku: "HP-ZBOOK-16-G9",
        precio: 3299.99,
        stock: 4,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/hp-zbook-16-g9" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[18].id, // Lenovo
        id_administrador: administrador.id,
        nombre: "Lenovo ThinkBook 15 G4 IAP",
        descripcion: "Laptop empresarial 15 pulgadas con Intel i5-1235U, 8GB RAM, 256GB SSD. Para pequeñas empresas.",
        sku: "LEN-TB-15-G4-IAP",
        precio: 699.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/lenovo-thinkbook-15-g4" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Pro 14\" M3 Pro",
        descripcion: "MacBook Pro 14 pulgadas con chip M3 Pro, 18GB RAM, 512GB SSD. Perfecto balance precio-rendimiento.",
        sku: "APPLE-MBP-14-M3PRO",
        precio: 1999.99,
        stock: 12,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mbp-14-m3pro" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Pro 13\" M2",
        descripcion: "MacBook Pro 13 pulgadas con chip M2, 8GB RAM, 256GB SSD. Touch Bar y Touch ID.",
        sku: "APPLE-MBP-13-M2",
        precio: 1299.99,
        stock: 18,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mbp-13-m2" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Air 13\" M1",
        descripcion: "MacBook Air 13 pulgadas con chip M1, 8GB RAM, 256GB SSD. Excelente relación precio-rendimiento.",
        sku: "APPLE-MBA-13-M1",
        precio: 999.99,
        stock: 25,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mba-13-m1" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Pro 16\" M2 Max",
        descripcion: "MacBook Pro 16 pulgadas con chip M2 Max, 32GB RAM, 1TB SSD. Para profesionales exigentes.",
        sku: "APPLE-MBP-16-M2MAX",
        precio: 3499.99,
        stock: 6,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mbp-16-m2max" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Air 15\" M3",
        descripcion: "MacBook Air 15 pulgadas con chip M3, 8GB RAM, 256GB SSD. El más reciente de la línea Air.",
        sku: "APPLE-MBA-15-M3",
        precio: 1399.99,
        stock: 20,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mba-15-m3" },
        galeria_imagenes: [],
        activo: true,
        destacado: false
      },
      {
        id_categoria: categoriasCreadas[7].id,
        id_marca: marcasCreadas[19].id, // Apple
        id_administrador: administrador.id,
        nombre: "MacBook Pro 14\" M3 Max",
        descripcion: "MacBook Pro 14 pulgadas con chip M3 Max, 36GB RAM, 1TB SSD. Máximo rendimiento en formato compacto.",
        sku: "APPLE-MBP-14-M3MAX",
        precio: 2999.99,
        stock: 8,
        imagen_principal: { url: "https://via.placeholder.com/400x400", public_id: "productos/apple-mbp-14-m3max" },
        galeria_imagenes: [],
        activo: true,
        destacado: true
      }
    ];

    await Producto.bulkCreate(productos);
    console.log('✅ Productos creados');

    console.log('🎉 ¡Base de datos poblada exitosamente!');
    console.log('📊 Resumen:');
    console.log('   - 1 Administrador creado (admin@gmail.com / Password1*?)');
    console.log('   - 8 Categorías creadas (Procesadores, Placas de Video, Memorias RAM, Mothers, Fuentes, Gabinetes, Monitores, Notebooks)');
    console.log('   - 20 Marcas creadas');
    console.log('   - 141 Productos creados distribuidos en todas las categorías:');
    console.log('     * Procesadores: 15 productos');
    console.log('     * Placas de Video: 16 productos');
    console.log('     * Memorias RAM: 17 productos');
    console.log('     * Mothers: 18 productos');
    console.log('     * Fuentes: 16 productos');
    console.log('     * Gabinetes: 17 productos');
    console.log('     * Monitores: 18 productos');
    console.log('     * Notebooks: 25 productos (10 productos de Apple)');
    console.log('   - Estructura de imágenes actualizada (placeholder URLs para carga manual posterior)');

  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    throw error;
  }
};

// Ejecutar el reset
resetDatabase();
