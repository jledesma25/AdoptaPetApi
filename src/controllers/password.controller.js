const userService = require("../services/user.service");
const passwordResetService = require("../services/passwordReset.service");
const emailService = require("../services/email.service");
const authService = require("../services/auth.service");
const { generateOTP, generateResetToken } = require("../utils/tokens");

// Solicitar recuperación de contraseña (envía OTP)
async function solicitarRecuperacion(req, res) {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: "Debe ingresar su correo electrónico" });
    }

    // Buscar usuario por correo
    const user = await userService.findUserByEmail(correo);
    if (!user) {
      return res.status(404).json({
        error: "El correo electrónico no se encuentra registrado",
      });
    }

    // Generar OTP y token
    const otpCode = generateOTP();
    const otpToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar en la base de datos
    await passwordResetService.createPasswordResetToken(
      user.id,
      otpCode,
      otpToken,
      expiresAt
    );

    // Enviar email con el código OTP
    const nombreCompleto = `${user.nombres} ${user.apellidos}`;
    await emailService.sendOTPEmail(user.correo, nombreCompleto, otpCode);

    // Retornar token (no el código OTP por seguridad)
    res.json({
      message: "Código de verificación enviado a tu correo",
      token: otpToken, // Token para verificar el OTP
    });
  } catch (err) {
    console.error("Error al solicitar recuperación:", err.message);
    if (err.message === "Error al enviar correo") {
      return res.status(500).json({ error: "Error al enviar correo" });
    }
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}

// Verificar código OTP
async function verificarOTP(req, res) {
  try {
    const { correo, otp_code, token } = req.body;

    if (!correo || !otp_code || !token) {
      return res.status(400).json({ error: "Correo, código OTP y token son requeridos" });
    }

    // Buscar usuario por correo
    const user = await userService.findUserByEmail(correo);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Buscar token en la base de datos
    const tokenData = await passwordResetService.findResetTokenByTokenAndUser(token, user.id);
    if (!tokenData) {
      return res.status(400).json({ error: "Token inválido" });
    }

    // Validar que no esté usado
    if (tokenData.used) {
      return res.status(400).json({ error: "Este código ya fue utilizado" });
    }

    // Validar que no esté expirado
    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).json({ error: "El código ha expirado. Solicita uno nuevo" });
    }

    // Validar que el código OTP coincida
    if (tokenData.otp_code !== otp_code) {
      return res.status(400).json({ error: "Código OTP incorrecto" });
    }

    // Marcar como usado
    await passwordResetService.markTokenAsUsed(tokenData.id);

    // Generar token de reset para cambiar contraseña (válido por 1 hora)
    const resetToken = generateResetToken();
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token de reset
    await passwordResetService.createResetTokenForPasswordChange(
      user.id,
      resetToken,
      resetExpiresAt
    );

    res.json({
      message: "Código verificado correctamente",
      reset_token: resetToken, // Token para cambiar contraseña
    });
  } catch (err) {
    console.error("Error al verificar OTP:", err.message);
    res.status(500).json({ error: "Error al verificar código" });
  }
}

// Cambiar contraseña después de verificar OTP
async function cambiarContrasena(req, res) {
  try {
    const { reset_token, nueva_password } = req.body;

    if (!reset_token || !nueva_password) {
      return res.status(400).json({ error: "Token y nueva contraseña son requeridos" });
    }

    if (nueva_password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Buscar token de reset
    const tokenData = await passwordResetService.findResetTokenByToken(reset_token);
    if (!tokenData) {
      return res.status(400).json({ error: "Token inválido" });
    }

    // Validar que no esté usado
    if (tokenData.used) {
      return res.status(400).json({ error: "Este token ya fue utilizado" });
    }

    // Validar que no esté expirado
    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).json({ error: "El token ha expirado. Solicita un nuevo código" });
    }

    // Hashear nueva contraseña
    const passwordHash = await authService.hashPassword(nueva_password);

    // Actualizar contraseña del usuario
    await userService.updateUserPassword(tokenData.usuario_id, passwordHash);

    // Marcar token como usado
    await passwordResetService.markTokenAsUsed(tokenData.id);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error al cambiar contraseña:", err.message);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
}

module.exports = {
  solicitarRecuperacion,
  verificarOTP,
  cambiarContrasena,
};
