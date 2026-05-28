const users = [
    {
        id: 1,
        id_klinik: 1,
        nama_lengkap: "Admin Medeva",
        email: "admin@medeva.com",
        username: "admin",
        password: "123456",
        is_admin: true,
        created_at: new Date("2026-01-01"),
        updated_at: new Date("2026-01-01"),
    },
    {
        id: 2,
        id_klinik: 1,
        nama_lengkap: "Tenaga Medis 197",
        email: "user@medeva.com",
        username: "user",
        password: "123456",
        is_admin: false,
        created_at: new Date("2026-01-01"),
        updated_at: new Date("2026-01-01"),
    },
];

module.exports = users;