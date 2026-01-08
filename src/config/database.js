const { Pool } = require("pg");

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }, // necesario si usas Railway
});

module.exports = pool;
