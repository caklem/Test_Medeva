const pool = require("../config/database");

const findKlinikByKodeAuth = async (kodeAuth) => {
  const { rows } = await pool.query("SELECT id FROM klinik WHERE kode_auth = $1", [kodeAuth]);
  return rows[0] || null;
};

const findByCredentials = async (username, password, idKlinik) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = $1 AND password_hash = $2 AND id_klinik = $3`,
    [username, password, idKlinik]
  );
  return rows[0] || null;
};

module.exports = { findKlinikByKodeAuth, findByCredentials };
