const pool = require("../config/database");
const userService = require("./user.service");

/**
 * Crea una solicitud de adopción.
 * nombre_completo y correo se obtienen del usuario autenticado (usuarioId); el body solo envía telefono y el resto.
 *
 * @param {number} usuarioId - ID del usuario autenticado (del token)
 * @param {object} body - { mascota_id, telefono, tipo_vivienda, tiene_otras_mascotas, foto_hogar_url?, motivo_adopcion }
 * @returns {object} Solicitud creada con id, estado, created_at
 */
async function crearSolicitud(usuarioId, body) {
  const {
    mascota_id,
    telefono,
    tipo_vivienda,
    tiene_otras_mascotas,
    foto_hogar_url,
    motivo_adopcion,
  } = body;

  const usuario = await userService.findUserById(usuarioId);
  if (!usuario) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }

  const nombre_completo = [usuario.nombres, usuario.apellidos].filter(Boolean).join(" ").trim() || "Sin nombre";
  const correo = usuario.correo || "";

  const result = await pool.query(
    `INSERT INTO solicitudes_adopcion (
      usuario_id, mascota_id, nombre_completo, telefono, correo,
      tipo_vivienda, tiene_otras_mascotas, foto_hogar_url, motivo_adopcion
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, usuario_id, mascota_id, nombre_completo, telefono, correo,
              tipo_vivienda, tiene_otras_mascotas, foto_hogar_url, motivo_adopcion,
              estado, created_at`,
    [
      usuarioId,
      mascota_id,
      nombre_completo,
      telefono,
      correo,
      tipo_vivienda,
      tiene_otras_mascotas === true,
      foto_hogar_url || null,
      motivo_adopcion,
    ]
  );

  return result.rows[0];
}

/**
 * Verifica que la mascota exista y esté en adopción.
 */
async function mascotaDisponible(mascotaId) {
  const result = await pool.query(
    `SELECT id FROM mascotas WHERE id = $1 AND deleted_at IS NULL AND LOWER(estado_adopcion) = LOWER('En Adopción')`,
    [mascotaId]
  );
  return result.rowCount > 0;
}

module.exports = {
  crearSolicitud,
  mascotaDisponible,
};
