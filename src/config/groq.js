import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Groq AI
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Configuración del modelo
export const GROQ_CONFIG = {
  model: 'openai/gpt-oss-20b',
  temperature: 0.6,
  max_tokens: 1000,
  top_p: 0.9,
  stream: false,
};

// Temáticas disponibles para el chatbot
export const TEMATICAS = {
  GAMING: {
    nombre: 'Gaming',
    descripcion: 'Información sobre videojuegos, consolas, PC gaming, periféricos',
    contexto: `Eres un asistente especializado en gaming para la tienda "Gamer Once, Gamer Always". 
    Ayudas a los clientes con información sobre videojuegos, consolas, PC gaming, periféricos y productos relacionados.
    Siempre mantén un tono amigable y entusiasta sobre el gaming.`
  },
  PRODUCTOS: {
    nombre: 'Productos',
    descripcion: 'Consultas sobre productos de la tienda, especificaciones, disponibilidad',
    contexto: `Eres un asistente de ventas para "Gamer Once, Gamer Always", una tienda de productos gaming.
    Ayudas a los clientes con información sobre productos, especificaciones técnicas, compatibilidad y recomendaciones.
    Siempre sugiere productos que puedan interesar al cliente.`
  },
  SOPORTE: {
    nombre: 'Soporte Técnico',
    descripcion: 'Ayuda técnica, resolución de problemas, configuraciones',
    contexto: `Eres un técnico especializado en productos gaming de "Gamer Once, Gamer Always".
    Ayudas a resolver problemas técnicos, configuraciones, instalaciones y troubleshooting.
    Proporciona soluciones paso a paso y claras.`
  },
  GENERAL: {
    nombre: 'General',
    descripcion: 'Consultas generales sobre la tienda, envíos, políticas',
    contexto: `Eres un asistente de atención al cliente de "Gamer Once, Gamer Always".
    Ayudas con consultas generales sobre la tienda, políticas de envío, devoluciones, horarios y servicios.
    Siempre mantén un tono profesional y servicial.`
  }
};

export default groqClient;
