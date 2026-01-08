const express = require("express");
const passwordController = require("../controllers/password.controller");

const router = express.Router();

// Solicitar recuperación de contraseña (envía OTP)
router.post("/usuarios/recuperar-contrasena", passwordController.solicitarRecuperacion);

// Verificar código OTP
router.post("/usuarios/verificar-otp", passwordController.verificarOTP);

// Cambiar contraseña después de verificar OTP
router.post("/usuarios/cambiar-contrasena", passwordController.cambiarContrasena);

module.exports = router;
