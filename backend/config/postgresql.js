const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  user: process.env.POSTGRES_USER || "postgres",
  password: String(process.env.POSTGRES_PASSWORD || ""), // ensure string
  database: process.env.POSTGRES_DB || "e_ecommerce",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const connectPostgreSQL = async () => {
  try {
    const client = await pool.connect();
    console.log(`✅ PostgreSQL Connected: ${client.database}`);
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    console.log("Continuing without PostgreSQL...");
  }
};

// Query helper function
pool.query = (text, params) => {
  return pool.query(text, params);
};

module.exports = connectPostgreSQL;
module.exports.pool = pool;
