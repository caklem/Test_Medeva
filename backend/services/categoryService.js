const pool = require("../config/database");

const getAll = async ({ page = 1, perPage = 5, search = "", status = "semua" }) => {
  page = parseInt(page);
  perPage = parseInt(perPage);

  let conditions = [];
  let params = [];
  let idx = 1;

  if (search) {
    conditions.push(`LOWER(nama_ruangan) LIKE LOWER($${idx})`);
    params.push(`%${search}%`);
    idx++;
  }

  if (status === "aktif") {
    conditions.push("is_active = TRUE");
  } else if (status === "non-aktif") {
    conditions.push("(is_active = FALSE OR is_active IS NULL)");
  }

  const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const countResult = await pool.query(`SELECT COUNT(*) FROM kategori_ruangan ${where}`, params);
  const totalData = parseInt(countResult.rows[0].count);

  const offset = (page - 1) * perPage;
  params.push(perPage);
  params.push(offset);

  const { rows } = await pool.query(
    `SELECT * FROM kategori_ruangan ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    params
  );

  return {
    page,
    perPage,
    totalData,
    totalPage: Math.ceil(totalData / perPage),
    data: rows,
  };
};

const getById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM kategori_ruangan WHERE id = $1", [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const {
    id_klinik,
    id_kelas_ruangan,
    jenis_kelamin,
    usia,
    penyakit,
    nama_ruangan,
    harga_ruangan,
    jumlah_kamar,
    fasilitas_ruangan,
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO kategori_ruangan (id_klinik, id_kelas_ruangan, jenis_kelamin, usia, penyakit, nama_ruangan, harga_ruangan, jumlah_kamar, fasilitas_ruangan)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      id_klinik,
      id_kelas_ruangan,
      jenis_kelamin || null,
      usia || null,
      penyakit || null,
      nama_ruangan,
      String(harga_ruangan),
      jumlah_kamar ? Number(jumlah_kamar) : 0,
      fasilitas_ruangan ? JSON.stringify(fasilitas_ruangan) : null,
    ]
  );

  return rows[0];
};

const update = async (id, data) => {
  const existing = await getById(id);
  if (!existing) return null;

  const fields = [];
  const params = [];
  let idx = 1;

  if (data.id_kelas_ruangan !== undefined) { fields.push(`id_kelas_ruangan = $${idx++}`); params.push(data.id_kelas_ruangan); }
  if (data.jenis_kelamin !== undefined) { fields.push(`jenis_kelamin = $${idx++}`); params.push(data.jenis_kelamin); }
  if (data.usia !== undefined) { fields.push(`usia = $${idx++}`); params.push(data.usia); }
  if (data.penyakit !== undefined) { fields.push(`penyakit = $${idx++}`); params.push(data.penyakit); }
  if (data.nama_ruangan !== undefined) { fields.push(`nama_ruangan = $${idx++}`); params.push(data.nama_ruangan); }
  if (data.harga_ruangan !== undefined) { fields.push(`harga_ruangan = $${idx++}`); params.push(String(data.harga_ruangan)); }
  if (data.fasilitas_ruangan !== undefined) { fields.push(`fasilitas_ruangan = $${idx++}`); params.push(JSON.stringify(data.fasilitas_ruangan)); }
  if (data.jumlah_kamar !== undefined) { fields.push(`jumlah_kamar = $${idx++}`); params.push(Number(data.jumlah_kamar)); }
  if (data.is_active !== undefined) { fields.push(`is_active = $${idx++}`); params.push(data.is_active); }

  fields.push(`updated_at = NOW()`);

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE kategori_ruangan SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    params
  );

  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query("DELETE FROM kategori_ruangan WHERE id = $1 RETURNING *", [id]);
  return rows[0] || null;
};

module.exports = { getAll, getById, create, update, remove };
