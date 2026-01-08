const { Pool } = require("pg");

// Validar variables de entorno de base de datos
if (!process.env.PGHOST || !process.env.PGDATABASE || !process.env.PGUSER || !process.env.PGPASSWORD) {
  console.warn("⚠️  Advertencia: Variables de entorno de PostgreSQL no configuradas completamente.");
  console.warn("   PGHOST, PGDATABASE, PGUSER, PGPASSWORD son requeridas.");
}

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 5432,
  ssl: { rejectUnauthorized: false }, // necesario si usas Railway
});

module.exports = pool;
