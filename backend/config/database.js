const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "medeva",
  user: process.env.DB_USER || "medeva_user",
  password: process.env.DB_PASSWORD || "medeva123",
});

pool.on("error", (err) => {
  console.error("Database pool error:", err);
});

module.exports = pool;
