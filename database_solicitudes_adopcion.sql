-- =====================================================
-- Script SQL: Solicitudes de adopción - AdoptaPet API
-- Ejecutar DESPUÉS de database.sql y database_mascotas.sql
-- La app sube la foto del hogar a Firebase Storage y envía la URL aquí.
-- =====================================================

-- -----------------------------------------------------
-- Tabla SOLICITUDES_ADOPCION
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes_adopcion (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mascota_id INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    tipo_vivienda VARCHAR(100) NOT NULL,
    tiene_otras_mascotas BOOLEAN DEFAULT FALSE,
    foto_hogar_url TEXT,
    motivo_adopcion TEXT NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_adopcion_usuario_id ON solicitudes_adopcion(usuario_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_adopcion_mascota_id ON solicitudes_adopcion(mascota_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_adopcion_estado ON solicitudes_adopcion(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_adopcion_created_at ON solicitudes_adopcion(created_at DESC);

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_solicitudes_adopcion_updated_at ON solicitudes_adopcion;
CREATE TRIGGER update_solicitudes_adopcion_updated_at
    BEFORE UPDATE ON solicitudes_adopcion
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
