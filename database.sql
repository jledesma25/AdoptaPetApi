-- Script SQL para crear las tablas de AdoptaPet API

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    numero_documento VARCHAR(8) NOT NULL UNIQUE,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_numero_documento ON usuarios(numero_documento) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_deleted_at ON usuarios(deleted_at);

-- Tabla de tokens para recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    otp_token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_usuario_id ON password_reset_tokens(usuario_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_otp_token ON password_reset_tokens(otp_token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en usuarios
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
