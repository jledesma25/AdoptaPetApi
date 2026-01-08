const pool = require("../config/database");

// Buscar usuario por número de documento
async function findUserByDocumento(numero_documento) {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE numero_documento=$1 AND deleted_at IS NULL",
    [numero_documento]
  );
  return result.rows[0] || null;
}

// Buscar usuario por correo
async function findUserByEmail(correo) {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE correo=$1 AND deleted_at IS NULL",
    [correo]
  );
  return result.rows[0] || null;
}

// Verificar si el documento ya existe
async function documentoExists(numero_documento) {
  const result = await pool.query(
    "SELECT id FROM usuarios WHERE numero_documento=$1 AND deleted_at IS NULL",
    [numero_documento]
  );
  return result.rows.length > 0;
}

// Verificar si el correo ya existe
async function emailExists(correo) {
  const result = await pool.query(
    "SELECT id FROM usuarios WHERE correo=$1 AND deleted_at IS NULL",
    [correo]
  );
  return result.rows.length > 0;
}

// Crear nuevo usuario
async function createUser(numero_documento, nombres, apellidos, correo, passwordHash) {
  const result = await pool.query(
    `INSERT INTO usuarios (numero_documento, nombres, apellidos, correo, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, numero_documento, nombres, apellidos, correo`,
    [numero_documento, nombres, apellidos, correo, passwordHash]
  );
  return result.rows[0];
}

// Actualizar contraseña del usuario
async function updateUserPassword(userId, passwordHash) {
  await pool.query("UPDATE usuarios SET password_hash=$1 WHERE id=$2", [
    passwordHash,
    userId,
  ]);
}

module.exports = {
  findUserByDocumento,
  findUserByEmail,
  documentoExists,
  emailExists,
  createUser,
  updateUserPassword,
};
