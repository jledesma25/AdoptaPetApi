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
 *                       raza: { type: string }
 *                       edad: { type: string, example: "3 meses" }
 *                       genero: { type: string, example: "macho" }
 *                       ubicacion: { type: string, example: "Madrid, ES" }
 *                       urgente: { type: boolean }
 *                       destacada: { type: boolean }
 *                       refugio: { type: object, nullable: true }
 *                       esFavorito: { type: boolean }
 *                 recienLlegados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       nombre: { type: string }
 *                       imagen_url: { type: string }
 *                       raza: { type: string }
 *                       edad: { type: string }
 *                       genero: { type: string }
 *                       ubicacion: { type: string }
 *                       urgente: { type: boolean }
 *                       destacada: { type: boolean }
 *                       refugio: { type: object, nullable: true }
 *                       esFavorito: { type: boolean }
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/",
  verifyToken,
  mascotaController.listarParaMenuPrincipal
);

module.exports = router;
