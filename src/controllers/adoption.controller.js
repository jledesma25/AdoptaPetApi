const adoptionService = require("../services/adoption.service");

/**
 * POST /solicitudes-adopcion
 * Crea una solicitud de adopción. Usuario desde token.
 * Body: mascota_id, nombre_completo, telefono, correo, tipo_vivienda, tiene_otras_mascotas, foto_hogar_url (opcional), motivo_adopcion
 */
async function crearSolicitud(req, res) {
  try {
    const usuarioId = req.user.id;
    const body = req.body;

    const mascotaId = body.mascota_id != null ? Number(body.mascota_id) : NaN;
    if (Number.isNaN(mascotaId)) {
      return res.status(400).json({ error: "mascota_id es requerido y debe ser un número" });
    }

    if (!body.nombre_completo?.trim()) {
      return res.status(400).json({ error: "nombre_completo es requerido" });
    }
    if (!body.telefono?.trim()) {
      return res.status(400).json({ error: "telefono es requerido" });
    }
    if (!body.correo?.trim()) {
      return res.status(400).json({ error: "correo es requerido" });
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
      nombre_completo: body.nombre_completo.trim(),
      telefono: body.telefono.trim(),
      correo: body.correo.trim(),
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
    res.status(500).json({ error: "Error al registrar la solicitud de adopción" });
  }
}

module.exports = {
  crearSolicitud,
};
