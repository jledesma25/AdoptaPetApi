const pool = require("../config/database");

// Crear token de reset de contraseña
async function createPasswordResetToken(usuario_id, otp_code, otp_token, expires_at) {
  await pool.query(
    `INSERT INTO password_reset_tokens (usuario_id, otp_code, otp_token, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [usuario_id, otp_code, otp_token, expires_at]
  );
}

// Buscar token de reset por token y usuario
async function findResetTokenByTokenAndUser(otp_token, usuario_id) {
  const result = await pool.query(
    `SELECT id, otp_code, expires_at, used, usuario_id
     FROM password_reset_tokens
     WHERE otp_token=$1 AND usuario_id=$2
     ORDER BY created_at DESC
     LIMIT 1`,
    [otp_token, usuario_id]
  );
  return result.rows[0] || null;
}

// Buscar token de reset por token (para cambio de contraseña)
async function findResetTokenByToken(otp_token) {
  const result = await pool.query(
    `SELECT id, usuario_id, expires_at, used
     FROM password_reset_tokens
     WHERE otp_token=$1 AND otp_code='RESET'
     ORDER BY created_at DESC
     LIMIT 1`,
    [otp_token]
  );
  return result.rows[0] || null;
}

// Marcar token como usado
async function markTokenAsUsed(tokenId) {
  await pool.query("UPDATE password_reset_tokens SET used=TRUE WHERE id=$1", [tokenId]);
}

// Crear token de reset para cambio de contraseña
async function createResetTokenForPasswordChange(usuario_id, reset_token, expires_at) {
  await pool.query(
    `INSERT INTO password_reset_tokens (usuario_id, otp_code, otp_token, expires_at, used)
     VALUES ($1, $2, $3, $4, FALSE)`,
    [usuario_id, "RESET", reset_token, expires_at]
  );
}

module.exports = {
  createPasswordResetToken,
  findResetTokenByTokenAndUser,
  findResetTokenByToken,
  markTokenAsUsed,
  createResetTokenForPasswordChange,
};
