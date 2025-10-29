# 🤖 Chatbot con Groq AI - Gamer Once, Gamer Always

## 📋 Configuración

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con:

```env
GROQ_API_KEY=tu_api_key_de_groq_aqui
NODE_ENV=development
```

### 2. Obtener API Key de Groq
1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el dashboard
4. Crea una nueva API key
5. Copia la key y ponla en tu archivo `.env`

## 🚀 Endpoints Disponibles

### Base URL: `/api/chatbot`

#### 1. Enviar Mensaje al Chatbot
```http
POST /api/chatbot/mensaje
Content-Type: application/json
```

**Body:**
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

**Parámetros:**
- `mensaje` (string, requerido): El mensaje del usuario
- `tematica` (string, opcional): Una de las siguientes opciones: `GAMING`, `PRODUCTOS`, `SOPORTE`, `GENERAL`. Por defecto: `GENERAL`
- `historial` (array, opcional): Historial de la conversación para mantener contexto

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "respuesta": "Para gaming en 4K te recomiendo considerar...",
    "tematica": "Gaming",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "estadisticas": {
      "tokens_prompt": 150,
      "tokens_completion": 200,
      "tokens_total": 350,
      "modelo": "llama3-8b-8192",
      "tematica": "GAMING"
    }
  }
}
```

#### 2. Health Check
```http
GET /api/chatbot/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Chatbot service is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "active"
}
```

## 🎯 Temáticas Disponibles

### 🎮 GAMING
- Información sobre videojuegos
- Recomendaciones de hardware
- Configuraciones de PC gaming
- Periféricos gaming

### 🛍️ PRODUCTOS
- Consultas sobre productos específicos
- Especificaciones técnicas
- Compatibilidad
- Recomendaciones de compra

### 🔧 SOPORTE
- Resolución de problemas técnicos
- Guías de instalación
- Configuraciones
- Troubleshooting

### ℹ️ GENERAL
- Información de la tienda
- Políticas de envío
- Devoluciones
- Horarios y contacto

## 💡 Ejemplos de Uso

### Frontend JavaScript
```javascript
// Enviar mensaje al chatbot
const respuesta = await fetch('/api/chatbot/mensaje', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mensaje: '¿Cuál es la mejor GPU para gaming?',
    tematica: 'GAMING',
    historial: [] // Opcional: historial de conversación
  })
}).then(res => res.json());

console.log(respuesta.data.respuesta);

// Health check
const health = await fetch('/api/chatbot/health')
  .then(res => res.json());
console.log(health.status); // 'active'
```

### cURL
```bash
# Enviar mensaje
curl -X POST http://localhost:3000/api/chatbot/mensaje \
  -H "Content-Type: application/json" \
  -d '{
    "mensaje": "¿Qué mouse gaming me recomiendan?",
    "tematica": "PRODUCTOS"
  }'

# Health check
curl -X GET http://localhost:3000/api/chatbot/health
```

## ⚙️ Configuración Avanzada

### Modificar Modelo de IA
En `src/config/groq.js`:
```javascript
export const GROQ_CONFIG = {
  model: 'llama3-70b-8192', // Cambiar modelo
  temperature: 0.5,         // Creatividad (0-1)
  max_tokens: 2048,         // Máximo de tokens
  top_p: 0.9,              // Diversidad
  stream: false,           // Respuesta en streaming
};
```

### Agregar Nueva Temática
En `src/config/groq.js`, agregar a `TEMATICAS`:
```javascript
MI_NUEVA_TEMATICA: {
  nombre: 'Mi Temática',
  descripcion: 'Descripción de la temática',
  contexto: 'Contexto específico para la IA...'
}
```

## 🔍 Troubleshooting

### Error: API Key inválida
- Verifica que tu `GROQ_API_KEY` esté correctamente configurada
- Asegúrate de que la API key sea válida y activa

### Error: Rate limit exceeded
- Groq tiene límites de uso por minuto/hora
- Implementa retry logic o reduce la frecuencia de requests

### Error: Modelo no disponible
- Verifica que el modelo especificado esté disponible en Groq
- Consulta la documentación de Groq para modelos disponibles

## 📈 Monitoreo

El sistema incluye estadísticas de uso en cada respuesta:
- Tokens utilizados
- Modelo usado
- Temática seleccionada
- Timestamp

Esto te permite monitorear el uso y optimizar el rendimiento.

## 🛡️ Seguridad

- La API key se maneja como variable de entorno
- Validación de entrada en todos los endpoints
- Límite de historial para evitar overflow
- Manejo de errores con respuestas fallback
