const crypto = require("crypto");

// Función para generar código OTP de 4 dígitos
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Función para generar token único
function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = {
  generateOTP,
  generateResetToken,
};
