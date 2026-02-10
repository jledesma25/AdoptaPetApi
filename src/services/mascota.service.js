const pool = require("../config/database");

/**
 * Formatea la edad para mostrar (ej: "3 meses", "2 años")
 */
function formatEdad(edadValor, edadUnidad) {
  if (!edadValor) return null;
  const unidad = edadUnidad || "meses";
  const singular = unidad === "años" ? "año" : unidad === "meses" ? "mes" : unidad;
  return edadValor === 1 ? `${edadValor} ${singular}` : `${edadValor} ${unidad}`;
}

/**
 * Formatea ubicación (ej: "Madrid, ES")
 */
function formatUbicacion(ciudad, pais) {
  if (!ciudad) return null;
  return pais ? `${ciudad}, ${pais}` : ciudad;
}

/**
 * Mapea fila de BD a objeto para la respuesta
 */
function mapMascotaToResponse(row, favoritosIds = []) {
  return {
    id: row.id,
    nombre: row.nombre,
    imagen_url: row.imagen_url,
    raza: row.raza,
    edad: formatEdad(row.edad_valor, row.edad_unidad),
    genero: row.genero,
    ubicacion: formatUbicacion(row.ubicacion_ciudad, row.ubicacion_pais),
    urgente: row.urgente || false,
    destacada: row.destacada || false,
    refugio: row.refugio_nombre
      ? { id: row.refugio_id, nombre: row.refugio_nombre, imagen_url: row.refugio_imagen_url }
      : null,
    esFavorito: favoritosIds.includes(row.id),
  };
}

/**
 * Lista mascotas para el Menú Principal:
 * - mascotasDestacadas: destacada = true
 * - recienLlegados: ordenadas por created_at desc
 * Filtro opcional por tipo: perro, gato, otro
 * Si hay usuarioId, incluye esFavorito
 */
async function listarParaMenuPrincipal(tipo = "todos", usuarioId = null) {
  const tipoFilter =
    tipo && tipo !== "todos"
      ? `AND m.tipo = $1`
      : "";
  const params = tipo && tipo !== "todos" ? [tipo] : [];

  // Obtener IDs de mascotas favoritas del usuario (si está logueado)
  let favoritosIds = [];
  if (usuarioId) {
    const favResult = await pool.query(
      "SELECT mascota_id FROM usuario_favoritos WHERE usuario_id = $1",
      [usuarioId]
    );
    favoritosIds = favResult.rows.map((r) => r.mascota_id);
  }

  const baseQuery = `
    SELECT m.id, m.nombre, m.imagen_url, m.raza, m.genero,
           m.edad_valor, m.edad_unidad, m.peso_kg, m.urgente, m.destacada,
           m.ubicacion_ciudad, m.ubicacion_pais, m.created_at,
           r.id AS refugio_id, r.nombre AS refugio_nombre, r.imagen_url AS refugio_imagen_url
    FROM mascotas m
    LEFT JOIN refugios r ON m.refugio_id = r.id AND r.deleted_at IS NULL
    WHERE m.deleted_at IS NULL
      AND m.estado_adopcion = 'en_adopcion'
      ${tipoFilter}
  `;

  // Mascotas destacadas (ordenadas para el carrusel horizontal)
  const destacadasResult = await pool.query(
    `${baseQuery} AND m.destacada = TRUE ORDER BY m.created_at DESC`,
    params
  );

  // Recién llegados (ordenadas por fecha, excluyendo las ya mostradas en destacadas si quieres, o mostrando todas)
  const recienResult = await pool.query(
    `${baseQuery} ORDER BY m.created_at DESC`,
    params
  );

  return {
    mascotasDestacadas: destacadasResult.rows.map((r) =>
      mapMascotaToResponse(r, favoritosIds)
    ),
    recienLlegados: recienResult.rows.map((r) =>
      mapMascotaToResponse(r, favoritosIds)
    ),
  };
}

module.exports = {
  listarParaMenuPrincipal,
  formatEdad,
  formatUbicacion,
};
