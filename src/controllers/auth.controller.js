const userService = require("../services/user.service");
const authService = require("../services/auth.service");
const { isValidDocumento, isValidEmail, isValidPassword } = require("../utils/validators");

// Registro de usuario
async function register(req, res) {
  try {
    const { numero_documento, nombres, apellidos, correo, password } = req.body;

    // Validaciones obligatorias
    if (!numero_documento) {
      return res.status(400).json({ error: "Debe ingresar su número de documento" });
    }
    if (!nombres) {
      return res.status(400).json({ error: "Debe ingresar sus nombres" });
    }
    if (!apellidos) {
      return res.status(400).json({ error: "Debe ingresar sus apellidos" });
    }
    if (!correo) {
      return res.status(400).json({ error: "Debe ingresar su correo electrónico" });
    }
    if (!password) {
      return res.status(400).json({ error: "Debe ingresar su contraseña" });
    }

    // Validación de número de documento: 8 dígitos numérico
    if (!isValidDocumento(numero_documento)) {
      return res.status(400).json({
        error: "El número de documento debe tener exactamente 8 dígitos numéricos",
      });
    }

    // Validación de correo electrónico
    if (!isValidEmail(correo)) {
      return res.status(400).json({ error: "El formato del correo electrónico no es válido" });
    }

    // Validación de contraseña: mínimo 6 caracteres
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si el documento ya existe
    if (await userService.documentoExists(numero_documento)) {
      return res.status(400).json({ error: "El número de documento ya se encuentra registrado" });
    }

    // Verificar si el correo ya existe
    if (await userService.emailExists(correo)) {
      return res.status(400).json({ error: "El correo ya se encuentra registrado" });
    }

    // Hashear contraseña
    const passwordHash = await authService.hashPassword(password);

    // Crear usuario
    const user = await userService.createUser(
      numero_documento,
      nombres,
      apellidos,
      correo,
      passwordHash
    );

    res.json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

// Login de usuario
async function login(req, res) {
  const { numero_documento, password } = req.body;

  try {
    if (!numero_documento) {
      return res.status(400).json({ error: "Debe ingresar su número de documento" });
    }
    if (!password) {
      return res.status(400).json({ error: "Debe ingresar su contraseña" });
    }

    // Buscar usuario
    const user = await userService.findUserByDocumento(numero_documento);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const match = await authService.comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT (30 minutos)
    const token = authService.generateToken({
      id: user.id,
      numero_documento: user.numero_documento,
    });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        numero_documento: user.numero_documento,
        nombres: user.nombres,
        apellidos: user.apellidos,
        nombreCompleto: `${user.nombres} ${user.apellidos}`,
        correo: user.correo,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno al autenticar" });
  }
}

module.exports = {
  register,
  login,
};
