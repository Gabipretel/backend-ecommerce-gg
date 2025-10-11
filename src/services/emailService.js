import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text, html) => {
  console.log("Enviando email a:", to);
  console.log("Asunto:", subject);
  console.log("Texto:", text);
  console.log("HTML:", html);
  
  try {
    const dataToSend = await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      text,
      html,
    });
    console.log("Email enviado correctamente:", dataToSend.messageId);
    console.log("Email Respuesta:", dataToSend.response);
    return dataToSend;
  } catch (error) {
    console.log("Error al enviar el email:", error);
    throw error; // Re-lanzar el error para que el controlador lo maneje
  }
};
