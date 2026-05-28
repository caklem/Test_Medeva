const pool = require("../config/database");

const getAll = async () => {
  const { rows } = await pool.query(
    "SELECT id, nama_kelas, is_active FROM kelas_ruangan WHERE is_active = TRUE ORDER BY nama_kelas"
  );
  return rows;
};

module.exports = { getAll };
