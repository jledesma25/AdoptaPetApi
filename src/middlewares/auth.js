const jwt = require("jsonwebtoken");

// Middleware para validar JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // datos del usuario en el token
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
}

// Middleware opcional: si hay token válido, pone req.user; si no, continúa sin error
function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();

  const token = authHeader.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    // Token inválido o expirado, continuar sin usuario
  }
  next();
}

module.exports = { verifyToken, optionalAuth };
