const express = require("express");
const passwordController = require("../controllers/password.controller");

const router = express.Router();

/**
 * @swagger
 * /usuarios/recuperar-contrasena:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Recuperación de Contraseña]
 *     description: Envía un código OTP por email al correo del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecuperarPasswordRequest'
 *     responses:
 *       200:
 *         description: Código de verificación enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código de verificación enviado a tu correo"
 *                 token:
 *                   type: string
 *                   description: Token para usar en el siguiente paso
 *                   example: "abc123def456..."
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Correo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/usuarios/recuperar-contrasena", passwordController.solicitarRecuperacion);

/**
 * @swagger
 * /usuarios/verificar-otp:
 *   post:
 *     summary: Verificar código OTP
 *     tags: [Recuperación de Contraseña]
 *     description: Verifica el código OTP recibido por email y retorna un token para cambiar la contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificarOTPRequest'
 *     responses:
 *       200:
 *         description: Código verificado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Código verificado correctamente"
 *                 reset_token:
 *                   type: string
 *                   description: Token para cambiar la contraseña
 *                   example: "xyz789..."
 *       400:
 *         description: Código incorrecto, expirado o token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/usuarios/verificar-otp", passwordController.verificarOTP);

/**
 * @swagger
 * /usuarios/cambiar-contrasena:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Recuperación de Contraseña]
 *     description: Cambia la contraseña usando el token recibido después de verificar el OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CambiarPasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada correctamente"
 *       400:
 *         description: Token inválido, expirado o contraseña no cumple requisitos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/usuarios/cambiar-contrasena", passwordController.cambiarContrasena);

module.exports = router;
