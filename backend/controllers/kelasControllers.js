const kelasService = require("../services/kelasService");

const getKelasRuangan = async (req, res) => {
  try {
    const data = await kelasService.getAll();
    res.json({ success: true, data });
  } catch (err) {
    console.error("getKelasRuangan error:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

module.exports = { getKelasRuangan };
