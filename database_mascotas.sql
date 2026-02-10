-- =====================================================
-- Script SQL: Mascotas y Refugios - AdoptaPet API
-- Ejecutar DESPUÉS de database.sql (requiere tabla usuarios)
-- Refugio = dato asociado a la mascota
-- Imagen = UNA sola por mascota
-- =====================================================
-- Si tienes una versión anterior, ejecuta antes (orden por FKs):
--   DROP TABLE IF EXISTS usuario_favoritos;
--   DROP TABLE IF EXISTS mascota_imagenes;
--   DROP TABLE IF EXISTS mascotas;
--   DROP TABLE IF EXISTS refugios;
-- =====================================================

-- -----------------------------------------------------
-- 1. Tabla REFUGIOS (refugio como dato: nombre, imagen, rol)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS refugios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    imagen_url VARCHAR(500),
    tipo_rol VARCHAR(100) DEFAULT 'Dueño/Cuidador',
    ubicacion_ciudad VARCHAR(255),
    ubicacion_pais VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_refugios_deleted_at ON refugios(deleted_at);

-- -----------------------------------------------------
-- 2. Tabla MASCOTAS (una sola imagen por mascota)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mascotas (
    id SERIAL PRIMARY KEY,
    refugio_id INTEGER REFERENCES refugios(id) ON DELETE SET NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    raza VARCHAR(255),
    genero VARCHAR(20),
    edad_valor INTEGER,
    edad_unidad VARCHAR(20),
    peso_kg DECIMAL(6,2),
    imagen_url VARCHAR(500),
    ubicacion_ciudad VARCHAR(255),
    ubicacion_pais VARCHAR(50),
    estado_adopcion VARCHAR(50) DEFAULT 'en_adopcion',
    urgente BOOLEAN DEFAULT FALSE,
    descripcion_personalidad TEXT,
    estado_salud TEXT,
    hogar_ideal TEXT,
    requiere_entrevista BOOLEAN DEFAULT FALSE,
    requiere_contrato BOOLEAN DEFAULT FALSE,
    requiere_seguimiento BOOLEAN DEFAULT FALSE,
    destacada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_mascotas_refugio_id ON mascotas(refugio_id);
CREATE INDEX IF NOT EXISTS idx_mascotas_tipo ON mascotas(tipo) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_mascotas_destacada ON mascotas(destacada) WHERE destacada = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_mascotas_created_at ON mascotas(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_mascotas_estado_adopcion ON mascotas(estado_adopcion) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_mascotas_deleted_at ON mascotas(deleted_at);

-- -----------------------------------------------------
-- 3. Tabla USUARIO_FAVORITOS (corazón en cada mascota)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_favoritos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mascota_id INTEGER NOT NULL REFERENCES mascotas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, mascota_id)
);

CREATE INDEX IF NOT EXISTS idx_usuario_favoritos_usuario_id ON usuario_favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_favoritos_mascota_id ON usuario_favoritos(mascota_id);

-- -----------------------------------------------------
-- Triggers
-- -----------------------------------------------------
DROP TRIGGER IF EXISTS update_refugios_updated_at ON refugios;
CREATE TRIGGER update_refugios_updated_at BEFORE UPDATE ON refugios
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_mascotas_updated_at ON mascotas;
CREATE TRIGGER update_mascotas_updated_at BEFORE UPDATE ON mascotas
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------
-- Datos de prueba (opcional)
-- -----------------------------------------------------

-- Refugios (ejecutar solo si las tablas están vacías)
INSERT INTO refugios (nombre, imagen_url, tipo_rol, ubicacion_ciudad, ubicacion_pais)
VALUES
    ('Refugio Huellitas', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100', 'Dueño/Cuidador', 'Madrid', 'España'),
    ('Amigos Peludos', NULL, 'Dueño/Cuidador', 'Barcelona', 'España');

-- Mascotas (una imagen por mascota)
INSERT INTO mascotas (refugio_id, nombre, tipo, raza, genero, edad_valor, edad_unidad, peso_kg, imagen_url, ubicacion_ciudad, ubicacion_pais, estado_adopcion, urgente, descripcion_personalidad, estado_salud, hogar_ideal, requiere_entrevista, requiere_contrato, requiere_seguimiento, destacada)
VALUES
    (1, 'Max', 'perro', 'Golden Retriever', 'macho', 3, 'meses', 12.5, 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400', 'Madrid', 'ES', 'en_adopcion', TRUE, 'Max es un cachorro muy juguetón y sociable.', 'Esterilizado, vacunado y con chip.', 'Casa con jardín o paseos largos.', TRUE, TRUE, TRUE, TRUE),
    (1, 'Luna', 'perro', 'Golden', 'hembra', 2, 'años', 25.0, 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400', 'Madrid', 'España', 'en_adopcion', FALSE, 'Luna es una perrita extremadamente cariñosa y tranquila.', 'Esterilizada, vacunada y con chip.', 'Casa con jardín o paseos largos.', TRUE, TRUE, TRUE, TRUE),
    (1, 'Boby', 'perro', 'Pug', 'macho', 4, 'meses', 5.0, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', 'Madrid', 'ES', 'en_adopcion', FALSE, 'Boby es un cachorro divertido y cariñoso.', 'Vacunado.', 'Piso o casa, se adapta fácil.', TRUE, TRUE, FALSE, FALSE),
    (1, 'Mimi', 'gato', 'Tabby', 'hembra', 2, 'años', 3.5, 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400', 'Madrid', 'ES', 'en_adopcion', FALSE, 'Mimi es independiente pero muy afectuosa.', 'Esterilizada, vacunada y con chip.', 'Hogar con espacio para explorar.', TRUE, TRUE, TRUE, FALSE),
    (1, 'Coco', 'perro', 'Golden', 'macho', 2, 'meses', 8.0, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400', 'Madrid', 'ES', 'en_adopcion', FALSE, 'Coco es enérgico y le encanta jugar.', 'Vacunado.', 'Familia activa con jardín.', TRUE, TRUE, TRUE, FALSE),
    (1, 'Pompon', 'otro', 'Conejo', 'macho', 1, 'años', 2.5, 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400', 'Madrid', 'ES', 'en_adopcion', FALSE, 'Pompon es un conejo dócil y curioso.', NULL, 'Espacio interior adecuado para conejo.', FALSE, FALSE, FALSE, FALSE);
