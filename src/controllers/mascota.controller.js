const mascotaService = require("../services/mascota.service");

/**
 * Lista mascotas para el Menú Principal:
 * - mascotasDestacadas: carrusel horizontal
 * - recienLlegados: grid
 * Query: tipo = todos | perro | gato | otro
 * Si el usuario está logueado (Authorization), incluye esFavorito en cada mascota
 */
async function listarParaMenuPrincipal(req, res) {
  try {
    let tipo = (req.query.tipo || "todos").toLowerCase();
    // Mapear plurales del frontend: perros->perro, gatos->gato, otros->otro
    if (tipo === "perros") tipo = "perro";
    if (tipo === "gatos") tipo = "gato";
    if (tipo === "otros") tipo = "otro";
    const usuarioId = req.user?.id || null;

    const resultado = await mascotaService.listarParaMenuPrincipal(tipo, usuarioId);

    res.json(resultado);
  } catch (err) {
    console.error("Error al listar mascotas:", err.message);
    res.status(500).json({ error: "Error al listar mascotas" });
  }
}

async function obtenerDetalle(req, res) {
  try {
    const mascotaId = Number(req.params.id);
    if (Number.isNaN(mascotaId)) {
      return res.status(400).json({ error: "ID de mascota inválido" });
    }

    const usuarioId = req.user?.id || null;
    const detalle = await mascotaService.obtenerDetalleMascota(mascotaId, usuarioId);

    if (!detalle) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    res.json(detalle);
  } catch (err) {
    console.error("Error al obtener detalle de mascota:", err);
    res.status(500).json({ error: "Error al obtener detalle de la mascota" });
  }
}

module.exports = {
  listarParaMenuPrincipal,
  obtenerDetalle,
};
