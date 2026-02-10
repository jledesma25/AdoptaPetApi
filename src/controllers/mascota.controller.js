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

module.exports = {
  listarParaMenuPrincipal,
};
