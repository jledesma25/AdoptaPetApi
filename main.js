require("dotenv").config();

const app = require("./src/config/server");
const authRoutes = require("./src/routes/auth.routes");
const passwordRoutes = require("./src/routes/password.routes");

// Endpoint de prueba rápida
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

// Rutas de autenticación
app.use("/", authRoutes);

// Rutas de recuperación de contraseña
app.use("/", passwordRoutes);

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
