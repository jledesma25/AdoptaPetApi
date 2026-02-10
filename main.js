require("dotenv").config();

const app = require("./src/config/server");
const authRoutes = require("./src/routes/auth.routes");
const passwordRoutes = require("./src/routes/password.routes");
const mascotaRoutes = require("./src/routes/mascota.routes");
const { specs, swaggerUi } = require("./src/config/swagger");

// Configurar Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "AdoptaPet API Documentation",
}));

// Validar variables de entorno críticas al inicio
function validateEnv() {
  const required = [
    "PGHOST",
    "PGDATABASE",
    "PGUSER",
    "PGPASSWORD",
    "JWT_SECRET"
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn("⚠️  Advertencia: Las siguientes variables de entorno no están configuradas:");
    missing.forEach(key => console.warn(`   - ${key}`));
    console.warn("\n📝 Configura estas variables en Railway para que la aplicación funcione correctamente.");
  }

  // Variables opcionales pero importantes
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  Advertencia: RESEND_API_KEY no configurada. La recuperación de contraseña no funcionará.");
  }
}

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Endpoint de prueba
 *     tags: [Utilidades]
 *     description: Verifica que el servidor está funcionando
 *     responses:
 *       200:
 *         description: Servidor respondiendo correctamente
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "pong 🏓"
 */
app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

// Rutas de autenticación
app.use("/", authRoutes);

// Rutas de recuperación de contraseña
app.use("/", passwordRoutes);

// Rutas de mascotas
app.use("/mascotas", mascotaRoutes);

// Validar variables de entorno
validateEnv();

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});
