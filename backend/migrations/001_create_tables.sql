CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE klinik (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    nama VARCHAR(50) NOT NULL,
    alamat VARCHAR(100),
    kode_auth VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    id_klinik UUID NOT NULL REFERENCES klinik(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(40) NOT NULL,
    email VARCHAR(30) NOT NULL,
    username VARCHAR(20) NOT NULL,
    password_hash VARCHAR NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE kelas_ruangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    id_klinik UUID NOT NULL REFERENCES klinik(id) ON DELETE CASCADE,
    nama_kelas VARCHAR(40) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE kategori_ruangan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
    id_klinik UUID NOT NULL REFERENCES klinik(id) ON DELETE CASCADE,
    id_kelas_ruangan UUID NOT NULL REFERENCES kelas_ruangan(id) ON DELETE CASCADE,
    jenis_kelamin VARCHAR(20),
    usia VARCHAR(20),
    penyakit VARCHAR(100),
    nama_ruangan VARCHAR(100) NOT NULL,
    harga_ruangan VARCHAR(100) NOT NULL,
    jumlah_kamar INTEGER DEFAULT 0,
    fasilitas_ruangan JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
