const { Resend } = require("resend");
const { buildEmailTemplate } = require("../utils/emailTemplate");

// Inicializar Resend solo si existe la API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Enviar email con código OTP
async function sendOTPEmail(correo, nombreCompleto, otpCode) {
  if (!resend) {
    throw new Error("RESEND_API_KEY no está configurada. Configura las variables de entorno.");
  }

  if (!process.env.EMAIL_FROM || !process.env.EMAIL_FROM_NAME) {
    throw new Error("EMAIL_FROM o EMAIL_FROM_NAME no están configuradas. Configura las variables de entorno.");
  }

  const emailHtml = buildEmailTemplate({
    headerSubtitle: "Recuperación de contraseña",
    sections: [
      {
        title: "Código de verificación",
        rows: [
          {
            label: "Hola",
            value: nombreCompleto,
          },
          {
            label: "Código OTP",
            value: otpCode,
          },
        ],
      },
    ],
    footerNote:
      "Este código expira en 15 minutos. Si no solicitaste este código, ignora este correo.",
  });

  try {
    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: [correo],
      subject: "Código de recuperación de contraseña - AdoptaPet",
      html: emailHtml,
    });
    console.log("Correo con OTP enviado ✅");
    return true;
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("Error al enviar correo");
  }
}

module.exports = {
  sendOTPEmail,
};
