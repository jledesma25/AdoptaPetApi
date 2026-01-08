-- Script para insertar datos de prueba
-- Usuario de prueba: documento 12345678, contraseña: 123456

-- Insertar usuario de prueba
INSERT INTO usuarios (numero_documento, nombres, apellidos, correo, password_hash)
VALUES (
    '12345678',
    'Juan',
    'Pérez García',
    'juan.perez@example.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
)
ON CONFLICT (numero_documento) DO NOTHING;

-- Nota: La contraseña hasheada corresponde a: 123456
-- Puedes usar este usuario para hacer login:
-- numero_documento: 12345678
-- password: 123456
