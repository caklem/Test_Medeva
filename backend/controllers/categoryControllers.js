const categoryService = require("../services/categoryService");

const getCategories = async (req, res) => {
  try {
    const { page, perPage, search, status } = req.query;
    const result = await categoryService.getAll({ page, perPage, search, status });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori ruangan tidak ditemukan",
      });
    }

    res.json({ success: true, data: category });
  } catch (err) {
    console.error("getCategoryById error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const addCategory = async (req, res) => {
  try {
    const {
      id_kelas_ruangan,
      jenis_kelamin,
      usia,
      penyakit,
      nama_ruangan,
      harga_ruangan,
      fasilitas_ruangan,
    } = req.body;

    if (!nama_ruangan || !id_kelas_ruangan || !harga_ruangan || !jenis_kelamin || !usia || !penyakit) {
      const missing = [];
      if (!nama_ruangan) missing.push("nama_ruangan");
      if (!id_kelas_ruangan) missing.push("id_kelas_ruangan");
      if (!harga_ruangan) missing.push("harga_ruangan");
      if (!jenis_kelamin) missing.push("jenis_kelamin");
      if (!usia) missing.push("usia");
      if (!penyakit) missing.push("penyakit");
      return res.status(400).json({
        success: false,
        message: `Field wajib diisi: ${missing.join(", ")}`,
      });
    }

    const newCategory = await categoryService.create({
      ...req.body,
      id_klinik: req.user?.id_klinik,
    });

    res.status(201).json({
      success: true,
      message: "Kategori ruangan berhasil ditambahkan",
      data: newCategory,
    });
  } catch (err) {
    console.error("addCategory error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await categoryService.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Kategori ruangan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Kategori ruangan berhasil diupdate",
      data: updated,
    });
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await categoryService.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Kategori ruangan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Kategori ruangan berhasil dihapus",
      data: deleted,
    });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
