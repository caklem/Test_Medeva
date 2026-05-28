const kategoriRuangan = require("../data/categories");
const kelasRuangan = require("../data/kelas_ruangan");

const getCategories = (req, res) => {
  let { page = 1, perPage = 5, search = "", status = "semua" } = req.query;

  page = parseInt(page);
  perPage = parseInt(perPage);

  let filteredCategories = kategoriRuangan.filter((category) => {
    const nameMatch = category.nama_ruangan
      .toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch =
      status === "semua" ||
      (status === "aktif" && category.is_active) ||
      (status === "non-aktif" && !category.is_active);

    return nameMatch && statusMatch;
  });

  const totalData = filteredCategories.length;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredCategories.slice(startIndex, endIndex);

  res.json({
    success: true,
    page,
    perPage,
    totalData,
    totalPage: Math.ceil(totalData / perPage),
    data: paginatedData,
  });
};

const getCategoryById = (req, res) => {
  const { id } = req.params;

  const category = kategoriRuangan.find((c) => c.id == id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Kategori ruangan tidak ditemukan",
    });
  }

  res.json({
    success: true,
    data: category,
  });
};

const addCategory = (req, res) => {
  const {
    id_kelas_ruangan,
    jenis_kelamin,
    usia,
    penyakit,
    nama_ruangan,
    harga_ruangan,
    fasilitas_ruangan,
  } = req.body;

  // Validasi required fields
  if (!nama_ruangan || !id_kelas_ruangan) {
    return res.status(400).json({
      success: false,
      message: "nama_ruangan dan id_kelas_ruangan wajib diisi",
    });
  }

  const newCategory = {
    id: kategoriRuangan.length + 1,
    id_klinik: req.user?.id_klinik || 1, // From JWT token
    id_kelas_ruangan,
    jenis_kelamin,
    usia,
    penyakit,
    nama_ruangan,
    harga_ruangan,
    fasilitas_ruangan,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  kategoriRuangan.push(newCategory);

  res.status(201).json({
    success: true,
    message: "Kategori ruangan berhasil ditambahkan",
    data: newCategory,
  });
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const {
    id_kelas_ruangan,
    jenis_kelamin,
    usia,
    penyakit,
    nama_ruangan,
    harga_ruangan,
    fasilitas_ruangan,
    is_active,
  } = req.body;

  const category = kategoriRuangan.find((c) => c.id == id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Kategori ruangan tidak ditemukan",
    });
  }

  if (id_kelas_ruangan) category.id_kelas_ruangan = id_kelas_ruangan;
  if (jenis_kelamin) category.jenis_kelamin = jenis_kelamin;
  if (usia) category.usia = usia;
  if (penyakit) category.penyakit = penyakit;
  if (nama_ruangan) category.nama_ruangan = nama_ruangan;
  if (harga_ruangan) category.harga_ruangan = harga_ruangan;
  if (fasilitas_ruangan) category.fasilitas_ruangan = fasilitas_ruangan;
  if (is_active !== undefined) category.is_active = is_active;
  category.updated_at = new Date();

  res.json({
    success: true,
    message: "Kategori ruangan berhasil diupdate",
    data: category,
  });
};

const deleteCategory = (req, res) => {
  const { id } = req.params;

  const categoryIndex = kategoriRuangan.findIndex((c) => c.id == id);

  if (categoryIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Kategori ruangan tidak ditemukan",
    });
  }

  const deletedCategory = kategoriRuangan.splice(categoryIndex, 1);

  res.json({
    success: true,
    message: "Kategori ruangan berhasil dihapus",
    data: deletedCategory[0],
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};