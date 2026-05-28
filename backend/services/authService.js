const bcrypt = require("bcryptjs");
const seedUsers = require("../data/users");
const seedKlinik = require("../data/klinik");

let users = seedUsers.map((u) => ({ ...u }));
let klinik = seedKlinik.map((k) => ({ ...k }));

const SALT_ROUNDS = 10;

for (const u of users) {
  if (!u.password.startsWith("$2a$") && !u.password.startsWith("$2b$")) {
    u.password = bcrypt.hashSync(u.password, SALT_ROUNDS);
  }
}

const findKlinikByKodeAuth = async (kodeAuth) => {
  return klinik.find((k) => k.kode_auth === kodeAuth) || null;
};

const findByCredentials = async (username, password, idKlinik) => {
  const user = users.find(
    (u) => u.username === username && String(u.id_klinik) === String(idKlinik)
  );
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return {
    id: user.id,
    id_klinik: user.id_klinik,
    is_admin: user.is_admin,
    username: user.username,
    nama_lengkap: user.nama_lengkap,
    password_hash: user.password,
  };
};

module.exports = { findKlinikByKodeAuth, findByCredentials };
