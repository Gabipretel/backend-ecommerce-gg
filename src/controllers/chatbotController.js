import groqClient, { GROQ_CONFIG, TEMATICAS } from '../config/groq.js';

// Procesa mensaje del chatbot
export const procesarMensaje = async (req, res) => {
  try {
    const { mensaje, tematica = 'GENERAL', historial = [] } = req.body;

    // Validaciones
    if (!mensaje || mensaje.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje es requerido'
      });
    }

    if (!TEMATICAS[tematica]) {
      return res.status(400).json({
        success: false,
        message: 'Temática no válida. Temáticas disponibles: ' + Object.keys(TEMATICAS).join(', ')
      });
    }

    // Construye el contexto de la conversación
    const contextoTematica = TEMATICAS[tematica].contexto;
    
    // Construye el historial de mensajes para Groq
    const mensajes = [
      {
        role: 'system',
        content: `${contextoTematica}
        
        Instrucciones adicionales:
        - Responde siempre en español
        - Mantén las respuestas concisas pero informativas
        - Si no sabes algo específico sobre un producto, sugiere contactar al equipo de ventas
        - Usa emojis ocasionalmente para hacer la conversación más amigable
        - Si el usuario pregunta sobre algo fuera del contexto gaming/tienda, redirige amablemente al tema
        `
      }
    ];

    // Agrega historial previo (máximo 10 mensajes para no saturar)
    const historialLimitado = historial.slice(-10);
    historialLimitado.forEach(item => {
      if (item.usuario) {
        mensajes.push({
          role: 'user',
          content: item.usuario
        });
      }
      if (item.asistente) {
        mensajes.push({
          role: 'assistant',
          content: item.asistente
        });
      }
    });

    // Agregar el mensaje actual
    mensajes.push({
      role: 'user',
      content: mensaje
    });

    // Llamada a Groq AI
    const completion = await groqClient.chat.completions.create({
      messages: mensajes,
      model: GROQ_CONFIG.model,
      temperature: GROQ_CONFIG.temperature,
      max_tokens: GROQ_CONFIG.max_tokens,
      top_p: GROQ_CONFIG.top_p,
      stream: GROQ_CONFIG.stream,
    });

    const respuesta = completion.choices[0]?.message?.content;

    if (!respuesta) {
      throw new Error('No se pudo generar una respuesta');
    }

    // Estadísticas de uso (opcional)
    const estadisticas = {
      tokens_prompt: completion.usage?.prompt_tokens || 0,
      tokens_completion: completion.usage?.completion_tokens || 0,
      tokens_total: completion.usage?.total_tokens || 0,
      modelo: GROQ_CONFIG.model,
      tematica: tematica
    };

    res.status(200).json({
      success: true,
      data: {
        respuesta: respuesta,
        tematica: TEMATICAS[tematica].nombre,
        timestamp: new Date().toISOString(),
        estadisticas: estadisticas
      }
    });

  } catch (error) {
    console.error('Error en procesarMensaje:', error);
    
    // Respuesta de fallback si hay error con Groq
    let mensajeError = 'Lo siento, hubo un problema procesando tu mensaje. ';
    
    if (error.message.includes('API key')) {
      mensajeError += 'Parece que hay un problema de configuración. Por favor, contacta al administrador.';
    } else if (error.message.includes('rate limit')) {
      mensajeError += 'Estamos experimentando mucho tráfico. Por favor, intenta nuevamente en unos momentos.';
    } else {
      mensajeError += 'Por favor, intenta reformular tu pregunta o contacta a nuestro equipo de soporte.';
    }

    res.status(500).json({
      success: false,
      message: mensajeError,
      respuesta_fallback: '¡Hola! 👋 Soy el asistente de Gamer Once, Gamer Always. Aunque estoy experimentando dificultades técnicas, puedes contactar directamente a nuestro equipo de soporte para cualquier consulta. ¡Gracias por tu paciencia! 🎮',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};