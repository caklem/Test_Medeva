const seedCategories = require("../data/categories");

let nextId = seedCategories.length + 1;
let data = seedCategories.map((c) => ({ ...c }));

const getAll = async ({ page = 1, perPage = 5, search = "", status = "semua" }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);

  let filtered = [...data];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((r) => r.nama_ruangan.toLowerCase().includes(s));
  }

  if (status === "aktif") {
    filtered = filtered.filter((r) => r.is_active === true);
  } else if (status === "non-aktif") {
    filtered = filtered.filter((r) => !r.is_active);
  }

  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const totalData = filtered.length;
  const offset = (page - 1) * perPage;
  const rows = filtered.slice(offset, offset + perPage);

  return {
    page,
    perPage,
    totalData,
    totalPage: Math.ceil(totalData / perPage),
    data: rows,
  };
};

const getById = async (id) => {
  return data.find((r) => String(r.id) === String(id)) || null;
};

const create = async (input) => {
  const newRoom = {
    id: nextId++,
    id_klinik: input.id_klinik,
    id_kelas_ruangan: input.id_kelas_ruangan,
    jenis_kelamin: input.jenis_kelamin || null,
    usia: input.usia || null,
    penyakit: input.penyakit || null,
    nama_ruangan: input.nama_ruangan,
    harga_ruangan: String(input.harga_ruangan),
    jumlah_kamar: input.jumlah_kamar ? Number(input.jumlah_kamar) : 0,
    fasilitas_ruangan: input.fasilitas_ruangan || null,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
  data.unshift(newRoom);
  return newRoom;
};

const update = async (id, input) => {
  const idx = data.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;

  const existing = data[idx];
  const updated = { ...existing };

  if (input.id_kelas_ruangan !== undefined) updated.id_kelas_ruangan = input.id_kelas_ruangan;
  if (input.jenis_kelamin !== undefined) updated.jenis_kelamin = input.jenis_kelamin;
  if (input.usia !== undefined) updated.usia = input.usia;
  if (input.penyakit !== undefined) updated.penyakit = input.penyakit;
  if (input.nama_ruangan !== undefined) updated.nama_ruangan = input.nama_ruangan;
  if (input.harga_ruangan !== undefined) updated.harga_ruangan = String(input.harga_ruangan);
  if (input.fasilitas_ruangan !== undefined) updated.fasilitas_ruangan = input.fasilitas_ruangan;
  if (input.jumlah_kamar !== undefined) updated.jumlah_kamar = Number(input.jumlah_kamar);
  if (input.is_active !== undefined) updated.is_active = input.is_active;

  updated.updated_at = new Date();
  data[idx] = updated;
  return updated;
};

const remove = async (id) => {
  const idx = data.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;
  const removed = data.splice(idx, 1)[0];
  return removed;
};

module.exports = { getAll, getById, create, update, remove };
