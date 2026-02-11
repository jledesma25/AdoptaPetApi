const express = require("express");
const mascotaController = require("../controllers/mascota.controller");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * /mascotas:
 *   get:
 *     summary: Listar mascotas para Menú Principal
 *     tags: [Mascotas]
 *     description: Retorna mascotas destacadas y recién llegadas. Soporta filtro por tipo (Todos, Perros, Gatos, Otros). Si se envía Authorization, incluye esFavorito para cada mascota.
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [todos, perro, perros, gato, gatos, otro, otros]
 *           default: todos
 *         description: Filtro por tipo de mascota
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas destacadas y recién llegadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mascotasDestacadas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       nombre: { type: string }
 *                       imagen_url: { type: string }
 *                       tipo: { type: string }
 *                       raza: { type: string }
 *                       edad: { type: string, example: "3 meses" }
 *                       genero: { type: string, example: "macho" }
 *                       ubicacion: { type: string, example: "Madrid, ES" }
 *                       urgente: { type: boolean }
 *                       destacada: { type: boolean }
 *                       esFavorito: { type: boolean }
 *                 recienLlegados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       nombre: { type: string }
 *                       imagen_url: { type: string }
 *                       tipo: { type: string }
 *                       raza: { type: string }
 *                       edad: { type: string }
 *                       genero: { type: string }
 *                       ubicacion: { type: string }
 *                       urgente: { type: boolean }
 *                       destacada: { type: boolean }
 *                       esFavorito: { type: boolean }
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/",
  verifyToken,
  mascotaController.listarParaMenuPrincipal
);

/**
 * @swagger
 * /mascotas/{id}:
 *   get:
 *     summary: Obtener detalle de una mascota
 *     tags: [Mascotas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Detalle completo de la mascota
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Mascota no encontrada
 */
router.get(
  "/:id",
  verifyToken,
  mascotaController.obtenerDetalle
);

module.exports = router;
