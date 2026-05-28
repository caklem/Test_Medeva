const jwt = require('jsonwebtoken');
const authService = require("../services/authService");

const login = async (req, res) => {
    const { username, password, klinikId } = req.body;

    if (!username || !password || !klinikId) {
        return res.status(400).json({
            success: false,
            message: "Klinik ID, username, dan password wajib diisi"
        });
    }

    try {
        const klinik = await authService.findKlinikByKodeAuth(klinikId);
        if (!klinik) {
            return res.status(401).json({
                success: false,
                message: "Klinik tidak ditemukan"
            });
        }

        const user = await authService.findByCredentials(username, password, klinik.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                id_klinik: user.id_klinik,
                is_admin: user.is_admin,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.json({
            success: true,
            message: "Login berhasil",
            token,
            user: {
                id: user.id,
                username: user.username,
                nama_lengkap: user.nama_lengkap,
                is_admin: user.is_admin,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
};

module.exports = {
    login,
};