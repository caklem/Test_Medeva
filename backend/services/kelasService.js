const seedKelas = require("../data/kelas_ruangan");

const getAll = async () => {
  return seedKelas
    .filter((k) => k.is_active === true)
    .sort((a, b) => a.nama_kelas.localeCompare(b.nama_kelas))
    .map((k) => ({
      id: k.id,
      nama_kelas: k.nama_kelas,
      is_active: k.is_active,
    }));
};

module.exports = { getAll };
