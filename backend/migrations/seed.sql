INSERT INTO klinik (id, nama, alamat, kode_auth) VALUES
('a0000000-0000-0000-0000-000000000001', 'Klinik Sjamsudin Noor', 'Jl. Sjamsudin Noor No.1', 'AUTH001');

INSERT INTO users (id, id_klinik, nama_lengkap, email, username, password_hash, is_admin) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Admin Medeva', 'admin@medeva.com', 'admin', '123456', TRUE),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Tenaga Medis 197', 'user@medeva.com', 'user', '123456', FALSE);

INSERT INTO kelas_ruangan (id, id_klinik, nama_kelas, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Jingga', TRUE),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Ocean Blue', TRUE),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Clover', TRUE);

INSERT INTO kategori_ruangan (id, id_klinik, id_kelas_ruangan, jenis_kelamin, usia, penyakit, nama_ruangan, harga_ruangan, jumlah_kamar, fasilitas_ruangan, is_active) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Perempuan', 'Dewasa', 'Non-Infeksius', 'Ruangan ABC', '500000', 0, '{"ac": true, "tv": true, "wifi": true, "kamar_mandi": true}', FALSE),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Semua', 'Anak', 'Infeksius', 'Raflesia 1', '750000', 0, '{"ac": true, "tv": true, "wifi": true, "kamar_mandi": true, "kursi_roda": true}', TRUE),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Laki-laki', 'Semua', 'Non-Infeksius', 'Macaca Fascicularis', '650000', 0, '{"ac": true, "tv": true, "wifi": true, "kamar_mandi": true}', TRUE);
