const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hashear contraseña
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Comparar contraseña con hash
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generar token JWT
function generateToken(payload, expiresIn = "30m") {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está configurada. Configura la variable de entorno JWT_SECRET en Railway.");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
};
