const express = require("express");
const router = express.Router();
const { getKelasRuangan } = require("../controllers/kelasControllers");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, getKelasRuangan);

module.exports = router;
