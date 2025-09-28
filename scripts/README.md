# 🗄️ Scripts de Base de Datos

## 📋 Descripción

Este directorio contiene scripts para gestionar la base de datos del e-commerce de tecnología.

## 🚀 Scripts Disponibles

### `seedDatabase.js`

Script completo para limpiar y poblar la base de datos con datos de tecnología realistas.

**¿Qué hace?**
1. 🧹 **Limpia** todas las tablas (productos, categorías, marcas)
2. 👤 **Crea** un administrador por defecto
3. 📂 **Crea** 8 categorías de tecnología
4. 🏷️ **Crea** 20 marcas reconocidas
5. 🛍️ **Crea** 25+ productos realistas

## 📊 Datos que se crean

### Categorías (8)
- Procesadores
- Placas de Video  
- Memorias RAM
- Mothers
- Fuentes
- Gabinetes
- Monitores
- Notebooks

### Marcas (20)
- **Procesadores**: Intel, AMD
- **Placas de Video**: NVIDIA, ASUS, MSI, Gigabyte
- **Memorias**: Corsair, G.Skill, Kingston
- **Mothers**: ASUS, ASRock
- **Fuentes**: EVGA, Seasonic, Corsair
- **Gabinetes**: NZXT, Cooler Master
- **Monitores**: Samsung, LG, Acer
- **Notebooks**: Dell, HP, Lenovo

### Productos (25+)
- Procesadores Intel y AMD de última generación
- Tarjetas gráficas RTX 40xx y RX 7xxx
- Memorias DDR4 y DDR5 de alta velocidad
- Placas madre Z790 y B650
- Fuentes certificadas 80+ Gold
- Gabinetes gaming con RGB
- Monitores 4K y 144Hz
- Laptops gaming de alta gama

## 🛠️ Cómo usar

### Opción 1: Ejecutar directamente
```bash
node scripts/seedDatabase.js
```

### Opción 2: Con npm script (recomendado)
Agregar al `package.json`:
```json
{
  "scripts": {
    "seed": "node scripts/seedDatabase.js",
    "seed:db": "node scripts/seedDatabase.js"
  }
}
```

Luego ejecutar:
```bash
npm run seed
```

## ⚠️ Advertencias

- **Este script ELIMINA todos los datos existentes** de productos, categorías y marcas
- **NO elimina** usuarios, administradores, órdenes, etc.
- **Crea un administrador por defecto** si no existe
- **Asegúrate de hacer backup** antes de ejecutar en producción

## 🔧 Configuración

El script usa la misma configuración de base de datos que tu aplicación principal (`src/db/connection.js`).

## 📝 Logs

El script muestra logs detallados del proceso:
- ✅ Operaciones exitosas
- ❌ Errores encontrados
- 📊 Resumen final con conteos

## 🎯 Casos de uso

- **Desarrollo**: Poblar base de datos para testing
- **Demo**: Crear datos de ejemplo para presentaciones
- **Reset**: Limpiar y empezar de nuevo
- **Testing**: Datos consistentes para pruebas

## 🔄 Re-ejecutar

Puedes ejecutar el script múltiples veces. Cada vez:
1. Limpia los datos existentes
2. Crea nuevos datos frescos
3. Mantiene la consistencia de IDs

## 📞 Soporte

Si encuentras errores:
1. Verifica la conexión a la base de datos
2. Asegúrate de que las tablas existan
3. Revisa los logs de error en la consola
