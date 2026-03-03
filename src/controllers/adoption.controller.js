const adoptionService = require("../services/adoption.service");

/**
 * POST /solicitudes-adopcion
 * Crea una solicitud de adopción. Usuario desde token; nombre y correo se obtienen del usuario en BD.
 * Body: mascota_id, telefono, tipo_vivienda, tiene_otras_mascotas, foto_hogar_url (opcional), motivo_adopcion
 */
async function crearSolicitud(req, res) {
  try {
    const usuarioId = req.user.id;
    const body = req.body;

    const mascotaId = body.mascota_id != null ? Number(body.mascota_id) : NaN;
    if (Number.isNaN(mascotaId)) {
      return res.status(400).json({ error: "mascota_id es requerido y debe ser un número" });
    }

    if (!body.telefono?.trim()) {
      return res.status(400).json({ error: "telefono es requerido" });
    }
    if (!body.tipo_vivienda?.trim()) {
      return res.status(400).json({ error: "tipo_vivienda es requerido" });
    }
    if (body.motivo_adopcion == null || String(body.motivo_adopcion).trim() === "") {
      return res.status(400).json({ error: "motivo_adopcion es requerido" });
    }

    const disponible = await adoptionService.mascotaDisponible(mascotaId);
    if (!disponible) {
      return res.status(404).json({ error: "Mascota no encontrada o no disponible para adopción" });
    }

    const solicitud = await adoptionService.crearSolicitud(usuarioId, {
      mascota_id: mascotaId,
      telefono: body.telefono.trim(),
      tipo_vivienda: body.tipo_vivienda.trim(),
      tiene_otras_mascotas: Boolean(body.tiene_otras_mascotas),
      foto_hogar_url: body.foto_hogar_url?.trim() || null,
      motivo_adopcion: String(body.motivo_adopcion).trim(),
    });

    res.status(201).json({
      message: "Solicitud de adopción registrada correctamente",
      solicitud,
    });
  } catch (err) {
    console.error("Error al crear solicitud de adopción:", err.message);
    const status = err.statusCode || 500;
    const message = status === 404 ? err.message : "Error al registrar la solicitud de adopción";
    res.status(status).json({ error: message });
  }
}

module.exports = {
  crearSolicitud,
};
