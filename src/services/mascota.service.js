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
    tipo: row.tipo || "perro",
    raza: row.raza,
    edad: formatEdad(row.edad_valor, row.edad_unidad),
    genero: row.genero,
    ubicacion: formatUbicacion(row.ubicacion_ciudad, row.ubicacion_pais),
    urgente: row.urgente || false,
    destacada: row.destacada || false,
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
    SELECT m.id, m.nombre, m.imagen_url, m.tipo, m.raza, m.genero,
           m.edad_valor, m.edad_unidad, m.urgente, m.destacada,
           m.ubicacion_ciudad, m.ubicacion_pais
    FROM mascotas m
    WHERE m.deleted_at IS NULL
      AND LOWER(m.estado_adopcion) = LOWER('En Adopción')
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

async function obtenerDetalleMascota(id, usuarioId = null) {
  const detailQuery = `
    SELECT m.id, m.nombre, m.imagen_url, m.tipo, m.raza, m.genero,
           m.edad_valor, m.edad_unidad, m.peso_kg, m.estado_adopcion, m.urgente,
           m.descripcion_personalidad, m.estado_salud, m.hogar_ideal,
           m.requiere_entrevista, m.requiere_contrato, m.requiere_seguimiento,
           m.ubicacion_ciudad, m.ubicacion_pais,
           r.id AS refugio_id, r.nombre AS refugio_nombre, r.imagen_url AS refugio_imagen_url,
           r.tipo_rol AS refugio_tipo_rol
    FROM mascotas m
    LEFT JOIN refugios r ON m.refugio_id = r.id AND r.deleted_at IS NULL
    WHERE m.deleted_at IS NULL AND m.id = $1
  `;

  const detailResult = await pool.query(detailQuery, [id]);
  if (detailResult.rowCount === 0) {
    return null;
  }

  const mascota = detailResult.rows[0];

  let esFavorito = false;
  let yaSolicitoAdopcion = false;
  if (usuarioId) {
    const favResult = await pool.query(
      "SELECT 1 FROM usuario_favoritos WHERE usuario_id = $1 AND mascota_id = $2 LIMIT 1",
      [usuarioId, id]
    );
    esFavorito = favResult.rowCount > 0;

    const solicitudResult = await pool.query(
      "SELECT 1 FROM solicitudes_adopcion WHERE usuario_id = $1 AND mascota_id = $2 LIMIT 1",
      [usuarioId, id]
    );
    yaSolicitoAdopcion = solicitudResult.rowCount > 0;
  }

  return {
    id: mascota.id,
    nombre: mascota.nombre,
    imagen_url: mascota.imagen_url,
    estado_adopcion: mascota.estado_adopcion,
    ubicacion: formatUbicacion(mascota.ubicacion_ciudad, mascota.ubicacion_pais),
    // La distancia no está disponible en la BD actualmente
    distancia_km: null,
    stats: {
      edad: formatEdad(mascota.edad_valor, mascota.edad_unidad),
      genero: mascota.genero,
      pesoKg: mascota.peso_kg,
      raza: mascota.raza,
    },
    refugio: mascota.refugio_nombre
      ? {
          id: mascota.refugio_id,
          nombre: mascota.refugio_nombre,
          tipoRol: mascota.refugio_tipo_rol || "Dueño/Cuidador",
          imagen_url: mascota.refugio_imagen_url,
        }
      : null,
    personalidad: mascota.descripcion_personalidad,
    salud: mascota.estado_salud,
    hogarIdeal: mascota.hogar_ideal,
    requisitos: {
      requiereEntrevista: mascota.requiere_entrevista,
      requiereContrato: mascota.requiere_contrato,
      requiereSeguimiento: mascota.requiere_seguimiento,
    },
    urgente: mascota.urgente || false,
    esFavorito,
    yaSolicitoAdopcion,
  };
}

module.exports = {
  listarParaMenuPrincipal,
  obtenerDetalleMascota,
  formatEdad,
  formatUbicacion,
};
