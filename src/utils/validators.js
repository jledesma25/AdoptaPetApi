// Función para validar correo electrónico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar número de documento (8 dígitos numérico)
function isValidDocumento(numero_documento) {
  const documentoStr = String(numero_documento).trim();
  return /^\d{8}$/.test(documentoStr);
}

// Validar contraseña (mínimo 6 caracteres)
function isValidPassword(password) {
  return password && password.length >= 6;
}

module.exports = {
  isValidEmail,
  isValidDocumento,
  isValidPassword,
};
