import { sendEmail } from "../services/emailService.js";

export const sendEmailController = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    // Valida que se proporcionen los campos requeridos
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: "Los campos 'to' y 'subject' son requeridos"
      });
    }

    // Envia el email
    await sendEmail(to, subject, text, html);

    res.status(200).json({
      success: true,
      message: "Email enviado correctamente"
    });
  } catch (error) {
    console.log("Error en sendEmailController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al enviar el email"
    });
  }
};
