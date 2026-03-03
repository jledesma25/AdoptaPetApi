const express = require("express");
const adoptionController = require("../controllers/adoption.controller");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * /solicitudes-adopcion:
 *   post:
 *     summary: Registrar solicitud de adopción
 *     tags: [Solicitudes de adopción]
 *     description: |
 *       Crea una solicitud de adopción para una mascota.
 *       El usuario se identifica con el token JWT.
 *       La foto del hogar se sube desde la app a Firebase Storage; aquí solo se envía la URL de descarga (opcional).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mascota_id
 *               - nombre_completo
 *               - telefono
 *               - correo
 *               - tipo_vivienda
 *               - motivo_adopcion
 *             properties:
 *               mascota_id:
 *                 type: integer
 *                 description: ID de la mascota a adoptar
 *                 example: 1
 *               nombre_completo:
 *                 type: string
 *                 example: "María González"
 *               telefono:
 *                 type: string
 *                 example: "+52 55 1234 5678"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "maria@correo.com"
 *               tipo_vivienda:
 *                 type: string
 *                 example: "Casa"
 *                 enum: [Casa, Departamento, Otro]
 *               tiene_otras_mascotas:
 *                 type: boolean
 *                 default: false
 *               foto_hogar_url:
 *                 type: string
 *                 nullable: true
 *                 description: URL de la foto del hogar (subida a Firebase Storage por la app)
 *               motivo_adopcion:
 *                 type: string
 *                 description: Motivo de adopción y estilo de vida
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud de adopción registrada correctamente"
 *                 solicitud:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     usuario_id: { type: integer }
 *                     mascota_id: { type: integer }
 *                     estado: { type: string, example: "pendiente" }
 *                     created_at: { type: string, format: date-time }
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Mascota no encontrada o no disponible
 *       500:
 *         description: Error del servidor
 */
router.post("/", verifyToken, adoptionController.crearSolicitud);

module.exports = router;
