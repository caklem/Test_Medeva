const jwt = require('jsonwebtoken');
const users = require("../data/users");

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username dan password wajib diisi"
        });
    }

    const user = users.find(
        (u) =>
            u.username === username &&
            u.password === password
    );

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
};

module.exports = {
    login,
};