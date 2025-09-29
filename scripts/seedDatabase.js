import { Categoria, Marca, Producto, Administrador } from "../src/models/index.js";
import sequelize from "../src/db/connection.js";

// Función para limpiar la base de datos
const limpiarBaseDeDatos = async () => {
  console.log("🧹 Limpiando base de datos...");
  
  try {
    // Desactivar verificación de claves foráneas temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Eliminar productos primero (por las claves foráneas)
    await Producto.destroy({ where: {}, force: true });
    console.log("✅ Productos eliminados");
    
    // Eliminar categorías
    await Categoria.destroy({ where: {}, force: true });
    console.log("✅ Categorías eliminadas");
    
    // Eliminar marcas
    await Marca.destroy({ where: {}, force: true });
    console.log("✅ Marcas eliminadas");
    
    // Reactivar verificación de claves foráneas
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log("🎉 Base de datos limpiada exitosamente");
  } catch (error) {
    console.error("❌ Error al limpiar base de datos:", error);
    throw error;
  }
};

// Función para crear un administrador por defecto
const crearAdministrador = async () => {
  console.log("👤 Creando administrador por defecto...");
  
  try {
    // Verificar si ya existe un administrador
    const adminExistente = await Administrador.findOne({ where: { email: 'admin@techstore.com' } });
    
    if (adminExistente) {
      console.log("✅ Administrador ya existe");
      return adminExistente;
    }
    
    const administrador = await Administrador.create({
      nombre: 'Admin',
      apellido: 'TechStore',
      email: 'admin@techstore.com',
      password: 'admin123', // En producción debería estar hasheada
      rol: 'superadmin',
      activo: true
    });
    
    console.log("✅ Administrador creado:", administrador.email);
    return administrador;
  } catch (error) {
    console.error("❌ Error al crear administrador:", error);
    throw error;
  }
};

// Función para crear categorías
const crearCategorias = async (administradorId) => {
  console.log("📂 Creando categorías...");
  
  const categorias = [
    {
      id_administrador: administradorId,
      nombre: "Procesadores",
      descripcion: "Procesadores Intel y AMD para gaming y productividad",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Placas de Video",
      descripcion: "Tarjetas gráficas NVIDIA y AMD para gaming y trabajo profesional",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Memorias RAM",
      descripcion: "Memoria RAM DDR4 y DDR5 de alta velocidad",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Mothers",
      descripcion: "Placas madre para Intel y AMD con las últimas tecnologías",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Fuentes",
      descripcion: "Fuentes de alimentación certificadas 80 Plus",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Gabinetes",
      descripcion: "Gabinetes gaming con RGB y excelente ventilación",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Monitores",
      descripcion: "Monitores gaming 4K, 144Hz y ultrawide",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Notebooks",
      descripcion: "Laptops gaming y profesionales de alta gama",
      activo: true
    }
  ];
  
  try {
    const categoriasCreadas = await Categoria.bulkCreate(categorias);
    console.log(`✅ ${categoriasCreadas.length} categorías creadas`);
    return categoriasCreadas;
  } catch (error) {
    console.error("❌ Error al crear categorías:", error);
    throw error;
  }
};

// Función para crear marcas
const crearMarcas = async (administradorId) => {
  console.log("🏷️ Creando marcas...");
  
  const marcas = [
    // Procesadores
    {
      id_administrador: administradorId,
      nombre: "Intel",
      descripcion: "Intel Corporation - Líder en procesadores",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "AMD",
      descripcion: "Advanced Micro Devices - Innovación en procesadores",
      activo: true
    },
    
    // Placas de Video
    {
      id_administrador: administradorId,
      nombre: "NVIDIA",
      descripcion: "NVIDIA Corporation - Líder en tarjetas gráficas",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "ASUS",
      descripcion: "ASUS - Hardware de alta calidad",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "MSI",
      descripcion: "MSI - Gaming y hardware profesional",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Gigabyte",
      descripcion: "Gigabyte - Innovación en hardware",
      activo: true
    },
    
    // Memorias RAM
    {
      id_administrador: administradorId,
      nombre: "Corsair",
      descripcion: "Corsair - Memoria y periféricos gaming",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "G.Skill",
      descripcion: "G.Skill - Memoria de alto rendimiento",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Kingston",
      descripcion: "Kingston - Soluciones de memoria confiables",
      activo: true
    },
    
    // Mothers
    {
      id_administrador: administradorId,
      nombre: "ASRock",
      descripcion: "ASRock - Placas madre innovadoras",
      activo: true
    },
    
    // Fuentes
    {
      id_administrador: administradorId,
      nombre: "EVGA",
      descripcion: "EVGA - Fuentes de alimentación premium",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Seasonic",
      descripcion: "Seasonic - Fuentes de alimentación de calidad",
      activo: true
    },
    
    // Gabinetes
    {
      id_administrador: administradorId,
      nombre: "NZXT",
      descripcion: "NZXT - Gabinetes gaming elegantes",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Cooler Master",
      descripcion: "Cooler Master - Soluciones de enfriamiento",
      activo: true
    },
    
    // Monitores
    {
      id_administrador: administradorId,
      nombre: "Samsung",
      descripcion: "Samsung - Monitores de alta calidad",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "LG",
      descripcion: "LG - Monitores gaming y profesionales",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Acer",
      descripcion: "Acer - Monitores gaming de alto rendimiento",
      activo: true
    },
    
    // Notebooks
    {
      id_administrador: administradorId,
      nombre: "Dell",
      descripcion: "Dell - Laptops profesionales y gaming",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "HP",
      descripcion: "HP - Laptops para trabajo y gaming",
      activo: true
    },
    {
      id_administrador: administradorId,
      nombre: "Lenovo",
      descripcion: "Lenovo - Laptops ThinkPad y gaming",
      activo: true
    }
  ];
  
  try {
    const marcasCreadas = await Marca.bulkCreate(marcas);
    console.log(`✅ ${marcasCreadas.length} marcas creadas`);
    return marcasCreadas;
  } catch (error) {
    console.error("❌ Error al crear marcas:", error);
    throw error;
  }
};

// Función para crear productos
const crearProductos = async (categorias, marcas, administradorId) => {
  console.log("🛍️ Creando productos...");
  
  // Crear mapas para facilitar la búsqueda
  const categoriaMap = {};
  const marcaMap = {};
  
  categorias.forEach(cat => categoriaMap[cat.nombre] = cat.id);
  marcas.forEach(marca => marcaMap[marca.nombre] = marca.id);
  
  const productos = [
    // PROCESADORES
    {
      id_categoria: categoriaMap["Procesadores"],
      id_marca: marcaMap["Intel"],
      id_administrador: administradorId,
      nombre: "Intel Core i7-13700K",
      descripcion: "Procesador Intel de 13va generación con 16 núcleos (8P+8E) y 24 hilos. Base 3.4GHz, Boost 5.4GHz. Socket LGA1700.",
      sku: "INT-I7-13700K",
      precio: 450.00,
      stock: 15,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567890/intel-i7-13700k.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567891/intel-i7-13700k-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567892/intel-i7-13700k-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567893/intel-i7-13700k-box.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Procesadores"],
      id_marca: marcaMap["Intel"],
      id_administrador: administradorId,
      nombre: "Intel Core i5-13600K",
      descripcion: "Procesador Intel de 13va generación con 14 núcleos (6P+8E) y 20 hilos. Base 3.5GHz, Boost 5.1GHz. Socket LGA1700.",
      sku: "INT-I5-13600K",
      precio: 320.00,
      stock: 25,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567894/intel-i5-13600k.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567895/intel-i5-13600k-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567896/intel-i5-13600k-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    {
      id_categoria: categoriaMap["Procesadores"],
      id_marca: marcaMap["AMD"],
      id_administrador: administradorId,
      nombre: "AMD Ryzen 7 7700X",
      descripcion: "Procesador AMD Ryzen 7000 con 8 núcleos y 16 hilos. Base 4.5GHz, Boost 5.4GHz. Socket AM5.",
      sku: "AMD-R7-7700X",
      precio: 380.00,
      stock: 20,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567897/amd-ryzen-7-7700x.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567898/amd-ryzen-7-7700x-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567899/amd-ryzen-7-7700x-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567900/amd-ryzen-7-7700x-box.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Procesadores"],
      id_marca: marcaMap["AMD"],
      id_administrador: administradorId,
      nombre: "AMD Ryzen 5 7600X",
      descripcion: "Procesador AMD Ryzen 7000 con 6 núcleos y 12 hilos. Base 4.7GHz, Boost 5.3GHz. Socket AM5.",
      sku: "AMD-R5-7600X",
      precio: 280.00,
      stock: 30,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567901/amd-ryzen-5-7600x.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567902/amd-ryzen-5-7600x-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567903/amd-ryzen-5-7600x-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    
    // PLACAS DE VIDEO
    {
      id_categoria: categoriaMap["Placas de Video"],
      id_marca: marcaMap["ASUS"],
      id_administrador: administradorId,
      nombre: "ASUS RTX 4080 ROG Strix",
      descripcion: "Tarjeta gráfica NVIDIA RTX 4080 con 16GB GDDR6X. Ray tracing y DLSS 3.0. RGB Aura Sync.",
      sku: "ASUS-RTX4080-ROG",
      precio: 1200.00,
      stock: 8,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567904/asus-rtx-4080-rog.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567905/asus-rtx-4080-rog-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567906/asus-rtx-4080-rog-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567907/asus-rtx-4080-rog-rgb.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567908/asus-rtx-4080-rog-box.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Placas de Video"],
      id_marca: marcaMap["MSI"],
      id_administrador: administradorId,
      nombre: "MSI RTX 4070 Gaming X Trio",
      descripcion: "Tarjeta gráfica NVIDIA RTX 4070 con 12GB GDDR6X. Gaming X Trio con RGB Mystic Light.",
      sku: "MSI-RTX4070-GXT",
      precio: 650.00,
      stock: 12,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567909/msi-rtx-4070-gaming.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567910/msi-rtx-4070-gaming-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567911/msi-rtx-4070-gaming-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567912/msi-rtx-4070-gaming-rgb.jpg"
      ],
      activo: true,
      destacado: false
    },
    {
      id_categoria: categoriaMap["Placas de Video"],
      id_marca: marcaMap["Gigabyte"],
      id_administrador: administradorId,
      nombre: "Gigabyte RX 7800 XT Gaming OC",
      descripcion: "Tarjeta gráfica AMD RX 7800 XT con 16GB GDDR6. Gaming OC con RGB Fusion.",
      sku: "GB-RX7800XT-GOC",
      precio: 550.00,
      stock: 10,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567913/gigabyte-rx-7800-xt.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567914/gigabyte-rx-7800-xt-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567915/gigabyte-rx-7800-xt-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567916/gigabyte-rx-7800-xt-rgb.jpg"
      ],
      activo: true,
      destacado: true
    },
    
    // MEMORIAS RAM
    {
      id_categoria: categoriaMap["Memorias RAM"],
      id_marca: marcaMap["Corsair"],
      id_administrador: administradorId,
      nombre: "Corsair Vengeance RGB 32GB DDR5-5600",
      descripcion: "Kit de memoria DDR5 32GB (2x16GB) a 5600MHz. RGB iCUE con disipadores de calor.",
      sku: "COR-VEN-RGB-32GB",
      precio: 180.00,
      stock: 20,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567917/corsair-vengeance-rgb.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567918/corsair-vengeance-rgb-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567919/corsair-vengeance-rgb-rgb.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567920/corsair-vengeance-rgb-box.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Memorias RAM"],
      id_marca: marcaMap["G.Skill"],
      id_administrador: administradorId,
      nombre: "G.Skill Trident Z5 16GB DDR5-6000",
      descripcion: "Kit de memoria DDR5 16GB (2x8GB) a 6000MHz. Trident Z5 con disipadores de aluminio.",
      sku: "GSK-TZ5-16GB",
      precio: 120.00,
      stock: 25,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    {
      id_categoria: categoriaMap["Memorias RAM"],
      id_marca: marcaMap["Kingston"],
      id_administrador: administradorId,
      nombre: "Kingston Fury Beast 32GB DDR4-3200",
      descripcion: "Kit de memoria DDR4 32GB (2x16GB) a 3200MHz. Fury Beast con disipadores de calor.",
      sku: "KIN-FB-32GB",
      precio: 140.00,
      stock: 18,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    
    // MOTHERS
    {
      id_categoria: categoriaMap["Mothers"],
      id_marca: marcaMap["ASUS"],
      id_administrador: administradorId,
      nombre: "ASUS ROG Strix Z790-E Gaming WiFi",
      descripcion: "Placa madre Intel Z790 con WiFi 6E, PCIe 5.0, DDR5, RGB Aura Sync y audio SupremeFX.",
      sku: "ASUS-Z790-ROG",
      precio: 350.00,
      stock: 12,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Mothers"],
      id_marca: marcaMap["MSI"],
      id_administrador: administradorId,
      nombre: "MSI B650 Tomahawk WiFi",
      descripcion: "Placa madre AMD B650 con WiFi 6, PCIe 4.0, DDR5, RGB Mystic Light y audio Realtek.",
      sku: "MSI-B650-TOM",
      precio: 220.00,
      stock: 15,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    
    // FUENTES
    {
      id_categoria: categoriaMap["Fuentes"],
      id_marca: marcaMap["EVGA"],
      id_administrador: administradorId,
      nombre: "EVGA SuperNOVA 850W 80+ Gold",
      descripcion: "Fuente de alimentación 850W certificada 80+ Gold, modular, con ventilador de 140mm.",
      sku: "EVGA-SN-850G",
      precio: 150.00,
      stock: 20,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Fuentes"],
      id_marca: marcaMap["Seasonic"],
      id_administrador: administradorId,
      nombre: "Seasonic Focus GX-750 80+ Gold",
      descripcion: "Fuente de alimentación 750W certificada 80+ Gold, modular, con ventilador de 120mm.",
      sku: "SEA-FGX-750",
      precio: 120.00,
      stock: 18,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    {
      id_categoria: categoriaMap["Fuentes"],
      id_marca: marcaMap["Corsair"],
      id_administrador: administradorId,
      nombre: "Corsair RM850x 80+ Gold",
      descripcion: "Fuente de alimentación 850W certificada 80+ Gold, modular, con ventilador de 135mm.",
      sku: "COR-RM850X",
      precio: 160.00,
      stock: 15,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: true
    },
    
    // GABINETES
    {
      id_categoria: categoriaMap["Gabinetes"],
      id_marca: marcaMap["NZXT"],
      id_administrador: administradorId,
      nombre: "NZXT H7 Flow RGB",
      descripcion: "Gabinete mid-tower con panel frontal mesh, RGB integrado, soporte para radiadores 360mm.",
      sku: "NZXT-H7-FLOW",
      precio: 180.00,
      stock: 12,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Gabinetes"],
      id_marca: marcaMap["Cooler Master"],
      id_administrador: administradorId,
      nombre: "Cooler Master MasterBox TD500 Mesh",
      descripcion: "Gabinete mid-tower con panel frontal mesh, RGB integrado, excelente ventilación.",
      sku: "CM-TD500-MESH",
      precio: 120.00,
      stock: 15,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    
    // MONITORES
    {
      id_categoria: categoriaMap["Monitores"],
      id_marca: marcaMap["Samsung"],
      id_administrador: administradorId,
      nombre: "Samsung Odyssey G7 32\" 4K 144Hz",
      descripcion: "Monitor gaming 32\" 4K UHD, 144Hz, 1ms, HDR600, FreeSync Premium Pro, curva 1000R.",
      sku: "SAM-G7-32-4K",
      precio: 800.00,
      stock: 8,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567921/samsung-odyssey-g7.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567922/samsung-odyssey-g7-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567923/samsung-odyssey-g7-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567924/samsung-odyssey-g7-gaming.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567925/samsung-odyssey-g7-box.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Monitores"],
      id_marca: marcaMap["LG"],
      id_administrador: administradorId,
      nombre: "LG UltraGear 27\" 1440p 165Hz",
      descripcion: "Monitor gaming 27\" QHD, 165Hz, 1ms, HDR10, G-Sync Compatible, Nano IPS.",
      sku: "LG-UG-27-QHD",
      precio: 450.00,
      stock: 12,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    {
      id_categoria: categoriaMap["Monitores"],
      id_marca: marcaMap["Acer"],
      id_administrador: administradorId,
      nombre: "Acer Predator XB273K 27\" 4K 144Hz",
      descripcion: "Monitor gaming 27\" 4K UHD, 144Hz, 1ms, HDR400, G-Sync, IPS.",
      sku: "ACR-PRED-XB273K",
      precio: 600.00,
      stock: 10,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: true
    },
    
    // NOTEBOOKS
    {
      id_categoria: categoriaMap["Notebooks"],
      id_marca: marcaMap["Dell"],
      id_administrador: administradorId,
      nombre: "Dell Alienware m15 R7 Gaming",
      descripcion: "Laptop gaming 15.6\" FHD 165Hz, Intel i7-12700H, RTX 3070 Ti, 16GB RAM, 1TB SSD.",
      sku: "DELL-ALW-M15R7",
      precio: 1800.00,
      stock: 5,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567926/dell-alienware-m15.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567927/dell-alienware-m15-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567928/dell-alienware-m15-back.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567929/dell-alienware-m15-keyboard.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567930/dell-alienware-m15-gaming.jpg"
      ],
      activo: true,
      destacado: true
    },
    {
      id_categoria: categoriaMap["Notebooks"],
      id_marca: marcaMap["ASUS"],
      id_administrador: administradorId,
      nombre: "ASUS ROG Strix G15 Gaming",
      descripcion: "Laptop gaming 15.6\" FHD 144Hz, AMD Ryzen 7 6800H, RTX 3060, 16GB RAM, 512GB SSD.",
      sku: "ASUS-ROG-G15",
      precio: 1200.00,
      stock: 8,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: false
    },
    {
      id_categoria: categoriaMap["Notebooks"],
      id_marca: marcaMap["HP"],
      id_administrador: administradorId,
      nombre: "HP Omen 17 Gaming Laptop",
      descripcion: "Laptop gaming 17.3\" FHD 144Hz, Intel i7-11800H, RTX 3070, 16GB RAM, 1TB SSD.",
      sku: "HP-OMEN-17",
      precio: 1400.00,
      stock: 6,
      imagen_url: "https://res.cloudinary.com/demo/image/upload/v1234567931/producto-default.jpg",
      galeria_imagenes: [
        "https://res.cloudinary.com/demo/image/upload/v1234567932/producto-default-front.jpg",
        "https://res.cloudinary.com/demo/image/upload/v1234567933/producto-default-back.jpg"
      ],
      activo: true,
      destacado: true
    }
  ];
  
  try {
    const productosCreados = await Producto.bulkCreate(productos);
    console.log(`✅ ${productosCreados.length} productos creados`);
    return productosCreados;
  } catch (error) {
    console.error("❌ Error al crear productos:", error);
    throw error;
  }
};

// Función principal
const seedDatabase = async () => {
  try {
    console.log("🚀 Iniciando proceso de seed de la base de datos...\n");
    
    // 1. Limpiar base de datos
    await limpiarBaseDeDatos();
    console.log("");
    
    // 2. Crear administrador
    const administrador = await crearAdministrador();
    console.log("");
    
    // 3. Crear categorías
    const categorias = await crearCategorias(administrador.id);
    console.log("");
    
    // 4. Crear marcas
    const marcas = await crearMarcas(administrador.id);
    console.log("");
    
    // 5. Crear productos
    const productos = await crearProductos(categorias, marcas, administrador.id);
    console.log("");
    
    console.log("🎉 ¡Base de datos poblada exitosamente!");
    console.log(`📊 Resumen:`);
    console.log(`   - 1 Administrador creado`);
    console.log(`   - ${categorias.length} Categorías creadas`);
    console.log(`   - ${marcas.length} Marcas creadas`);
    console.log(`   - ${productos.length} Productos creados`);
    
  } catch (error) {
    console.error("💥 Error durante el proceso de seed:", error);
  } finally {
    // Cerrar conexión
    await sequelize.close();
    console.log("\n🔌 Conexión a la base de datos cerrada");
  }
};

// Ejecutar el script
seedDatabase();
