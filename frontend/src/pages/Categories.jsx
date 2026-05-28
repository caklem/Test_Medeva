import { useState, useEffect } from "react";
import * as yup from "yup";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AktifkanButton from "@/components/AktifkanButton";
import api from "@/services/api";

const roomSchema = yup.object().shape({
  nama_ruangan: yup.string().required("Nama ruangan wajib diisi"),
  id_kelas_ruangan: yup.string().required("Kelas ruangan wajib dipilih"),
  jumlah_kamar: yup.number().min(0, "Jumlah kamar tidak valid").nullable().transform((v) => (v === "" ? null : v)),
  harga_ruangan: yup.number().min(0, "Harga tidak valid").required("Harga ruangan wajib diisi"),
  jenis_kelamin: yup.string().required("Jenis kelamin wajib dipilih"),
  usia: yup.string().required("Usia wajib dipilih"),
  penyakit: yup.string().required("Penyakit wajib dipilih"),
});

const initialForm = {
  nama_ruangan: "",
  id_kelas_ruangan: "",
  jumlah_kamar: "",
  harga_ruangan: "",
  jenis_kelamin: "",
  usia: "",
  penyakit: "",
};

const initialFacilities = {
  ac: false,
  kipas_angin: false,
  tv: false,
  amenities: false,
  kamar_mandi: false,
  kulkas: false,
  bed_penunggu: false,
  lemari: false,
  kursi: false,
  dispenser: false,
  sofa: false,
  overbed_table: false,
  meja: false,
  kabinet: false,
  bed_bayi: false,
};

const kelasOptions = [
  { value: "1", label: "Jingga" },
  { value: "2", label: "Ocean Blue" },
  { value: "3", label: "Clover" },
];

function Categories() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("semua");
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isActive, setIsActive] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.is_admin === true;

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/kategori-ruangan", {
          params: { page, perPage, search, status: activeFilter },
        });
        if (!ignore) {
          setRooms(res.data.data);
          setTotal(res.data.totalData);
        }
      } catch {
        if (!ignore) setRooms([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [page, perPage, search, activeFilter]);

  const totalPages = Math.ceil(total / perPage) || 1;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleFacilityChange = (facility) => {
    setFacilities((prev) => ({ ...prev, [facility]: !prev[facility] }));
  };

  const openAddForm = () => {
    setEditingRoom(null);
    setFormData(initialForm);
    setFacilities(initialFacilities);
    setErrors({});
    setSelectedRoom(null);
    setShowForm(true);
  };

  const openDetail = (room) => {
    setSelectedRoom(room);
    setShowForm(false);
  };

  const openEditForm = (room) => {
    setEditingRoom(room);
    setFormData({
      nama_ruangan: room.nama_ruangan || "",
      id_kelas_ruangan: String(room.id_kelas_ruangan || ""),
      jumlah_kamar: room.jumlah_kamar ?? "",
      harga_ruangan: room.harga_ruangan ?? "",
      jenis_kelamin: room.jenis_kelamin || "",
      usia: room.usia || "",
      penyakit: room.penyakit || "",
    });
    setFacilities({
      ...initialFacilities,
      ...(room.fasilitas_ruangan || {}),
    });
    setErrors({});
    setSelectedRoom(null);
    setShowForm(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await roomSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((validationErr) => {
        fieldErrors[validationErr.path] = validationErr.message;
      });
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    const payload = {
      nama_ruangan: formData.nama_ruangan,
      id_kelas_ruangan: Number(formData.id_kelas_ruangan),
      jumlah_kamar: formData.jumlah_kamar ? Number(formData.jumlah_kamar) : 0,
      harga_ruangan: Number(formData.harga_ruangan),
      jenis_kelamin: formData.jenis_kelamin,
      usia: formData.usia,
      penyakit: formData.penyakit,
      fasilitas_ruangan: facilities,
    };

    try {
      if (editingRoom) {
        await api.put(`/kategori-ruangan/${editingRoom.id}`, payload);
      } else {
        await api.post("/kategori-ruangan", payload);
      }
      setShowForm(false);
      setEditingRoom(null);
      setPage(1);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan data";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!selectedRoom) return;
    try {
      await api.put(`/kategori-ruangan/${selectedRoom.id}`, {
        is_active: true,
      });
      setSelectedRoom((prev) => prev ? { ...prev, is_active: true } : null);
      setShowConfirmModal(false);
    } catch {
      alert("Gagal mengubah status");
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    try {
      await api.delete(`/kategori-ruangan/${selectedRoom.id}`);
      setSelectedRoom(null);
      setShowDeleteModal(false);
    } catch {
      alert("Gagal menghapus ruangan");
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setFacilities(initialFacilities);
    setErrors({});
    setIsActive(false);
    setEditingRoom(null);
  };

  const content = (
    <>
      {/* BREADCRUMB */}
      <div style={{ paddingLeft: "16px", paddingTop: "12px", paddingBottom: "8px", fontSize: "13px", fontWeight: 400, color: "#8b9dc3" }}>
        Rawat Inap / Pengaturan Kategori Ruangan
      </div>

      {/* MAIN CONTENT */}
      <div className="flex">
        {/* LEFT PANEL */}
        <div style={{ width: "340px", backgroundColor: "#ffffff", borderRadius: "8px", margin: "8px 0 8px 8px", padding: "24px" }}>
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3, maxWidth: "200px" }}>
              TAMBAH KATEGORI<br />RUANGAN
            </div>
            {isAdmin && (
              <button onClick={openAddForm} style={{ backgroundColor: "#3b82f6", color: "#fff", fontSize: "14px", fontWeight: 500, padding: "8px 24px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
                Tambah
              </button>
            )}
          </div>

          {/* STATUS FILTER */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#333", marginBottom: "10px" }}>Status</div>
            <div className="flex" style={{ gap: 0 }}>
              <button onClick={() => { setActiveFilter("semua"); setPage(1); }} style={{ padding: "8px 16px", fontSize: "12px", fontWeight: activeFilter === "semua" ? 700 : 500, border: activeFilter === "semua" ? "1px solid #333" : "1px solid #ddd", borderRight: activeFilter === "semua" ? "1px solid #333" : "1px solid #ddd", backgroundColor: "#fff", color: activeFilter === "semua" ? "#333" : "#888", borderRadius: "6px 0 0 6px", cursor: "pointer" }}>
                SEMUA
              </button>
              <button onClick={() => { setActiveFilter("aktif"); setPage(1); }} style={{ padding: "8px 16px", fontSize: "12px", fontWeight: activeFilter === "aktif" ? 700 : 500, border: "1px solid #ddd", borderLeft: "none", backgroundColor: "#fff", color: activeFilter === "aktif" ? "#333" : "#888", borderRadius: 0, cursor: "pointer" }}>
                AKTIF
              </button>
              <button onClick={() => { setActiveFilter("non-aktif"); setPage(1); }} style={{ padding: "8px 16px", fontSize: "12px", fontWeight: activeFilter === "non-aktif" ? 700 : 500, border: activeFilter === "non-aktif" ? "1px solid #333" : "1px solid #ddd", borderLeft: "none", backgroundColor: "#fff", color: activeFilter === "non-aktif" ? "#333" : "#888", borderRadius: "0 6px 6px 0", cursor: "pointer" }}>
                NON-AKTIF
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex" style={{ marginTop: "16px" }}>
            <input
              type="text"
              placeholder="Pencarian"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ flex: 1, border: "1px solid #ddd", borderRight: "none", borderRadius: "6px 0 0 6px", padding: "10px 14px", fontSize: "13px", outline: "none", color: "#333" }}
            />
            <button style={{ width: "40px", backgroundColor: "#3b82f6", border: "none", borderRadius: "0 6px 6px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* TABLE */}
          <div style={{ marginTop: "20px" }}>
            <div className="flex" style={{ borderBottom: "1px solid #e0e0e0", padding: "10px 0" }}>
              <div style={{ width: "40px", fontSize: "13px", fontWeight: 600, color: "#555" }}>#</div>
              <div style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "#555" }}>Kategori Ruangan</div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">Tidak ada data</div>
            ) : (
              rooms.map((room, index) => {
                const kelasLabel = kelasOptions.find(
                  (k) => String(k.value) === String(room.id_kelas_ruangan)
                )?.label || "-";

                return (
                  <div key={room.id} className="flex items-center" style={{ padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ width: "40px", fontSize: "13px", color: "#888", alignSelf: "flex-start", paddingTop: "4px" }}>
                      {index + 1 + (page - 1) * perPage}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center" style={{ marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#333" }}>{room.nama_ruangan}</span>
                        <span style={{ display: "inline-block", marginLeft: "8px", backgroundColor: room.is_active ? "#5a8a5e" : "#c5a84f", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px" }}>
                          {room.is_active ? "Aktif" : "Non-Aktif"}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#8b7355", lineHeight: 1.7 }}>
                        <div>Harga: Rp {Number(room.harga_ruangan || 0).toLocaleString("id-ID")}</div>
                        <div>Kelas: {kelasLabel}</div>
                        <div>Jenis Kelamin: {room.jenis_kelamin || "-"}</div>
                        <div>Usia: {room.usia || "-"}</div>
                        <div>Penyakit: {room.penyakit || "-"}</div>
                      </div>
                    </div>
                    <div style={{ width: "40px" }}>
                      <button
                        onClick={() => openDetail(room)}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#3b82f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-4" style={{ fontSize: "12px", color: "#888" }}>
            <span>Total {total} data</span>
            <div className="flex gap-1 items-center">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 500, border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#fff", color: page <= 1 ? "#ccc" : "#555", cursor: page <= 1 ? "not-allowed" : "pointer" }}
              >
                {"<"}
              </button>
              <span style={{ padding: "0 8px", fontSize: "12px", color: "#555" }}>{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 500, border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "#fff", color: page >= totalPages ? "#ccc" : "#555", cursor: page >= totalPages ? "not-allowed" : "pointer" }}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col" style={{ margin: "8px 8px 8px 8px" }}>
          {showForm ? (
            <div className="flex-1 bg-white rounded-lg p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {editingRoom ? "EDIT KATEGORI RUANGAN" : "FORM TAMBAH KATEGORI RUANGAN"}
                  </h2>
                  <p className="text-xs text-red-500 mt-1">*) Wajib diisi</p>
                </div>
                <AktifkanButton onClick={() => setShowConfirmModal(true)} />
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase">Informasi Ruangan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nama / Nomor Ruangan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_ruangan"
                        value={formData.nama_ruangan}
                        onChange={handleFormChange}
                        placeholder="Nama / Nomor Ruangan"
                        className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 ${errors.nama_ruangan ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors.nama_ruangan && <p className="text-xs text-red-500 mt-1">{errors.nama_ruangan}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Kelas <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="id_kelas_ruangan"
                        value={formData.id_kelas_ruangan}
                        onChange={handleFormChange}
                        className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 ${errors.id_kelas_ruangan ? "border-red-400" : "border-gray-300"}`}
                      >
                        <option value="">Pilih Kelas</option>
                        {kelasOptions.map((k) => (
                          <option key={k.value} value={k.value}>{k.label}</option>
                        ))}
                      </select>
                      {errors.id_kelas_ruangan && <p className="text-xs text-red-500 mt-1">{errors.id_kelas_ruangan}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Jumlah Kamar <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="jumlah_kamar"
                        value={formData.jumlah_kamar}
                        onChange={handleFormChange}
                        placeholder="0"
                        className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 ${errors.jumlah_kamar ? "border-red-400" : "border-gray-300"}`}
                        min="0"
                      />
                      {errors.jumlah_kamar && <p className="text-xs text-red-500 mt-1">{errors.jumlah_kamar}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Harga Ruangan <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="bg-gray-100 px-2 py-2 border border-gray-300 border-r-0 rounded-l text-xs">Rp</span>
                        <input
                          type="number"
                          name="harga_ruangan"
                          value={formData.harga_ruangan}
                          onChange={handleFormChange}
                          placeholder="0"
                          className={`flex-1 px-3 py-2 border rounded-r text-sm outline-none focus:ring-2 focus:ring-teal-500 ${errors.harga_ruangan ? "border-red-400" : "border-gray-300"}`}
                          min="0"
                        />
                      </div>
                      {errors.harga_ruangan && <p className="text-xs text-red-500 mt-1">{errors.harga_ruangan}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase">Fasilitas Ruangan</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { key: "ac", label: "ac" },
                      { key: "kipas_angin", label: "kipas angin" },
                      { key: "tv", label: "tv" },
                      { key: "amenities", label: "amenities" },
                      { key: "kamar_mandi", label: "kamar mandi" },
                      { key: "kulkas", label: "kulkas" },
                      { key: "bed_penunggu", label: "bed penunggu" },
                      { key: "lemari", label: "lemari" },
                      { key: "kursi", label: "kursi" },
                      { key: "dispenser", label: "dispenser" },
                      { key: "sofa", label: "sofa" },
                      { key: "overbed_table", label: "overbed table" },
                      { key: "meja", label: "meja" },
                      { key: "kabinet", label: "kabinet" },
                      { key: "bed_bayi", label: "bed bayi" },
                    ].map((facility) => (
                      <label key={facility.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={facilities[facility.key]} onChange={() => handleFacilityChange(facility.key)} className="w-4 h-4 rounded border-gray-300" />
                        <span className="text-xs text-gray-600">{facility.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {[{ value: "Semua", label: "Semua" }, { value: "Laki-laki", label: "Laki-laki" }, { value: "Perempuan", label: "Perempuan" }].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="jenis_kelamin" value={option.value} checked={formData.jenis_kelamin === option.value} onChange={handleFormChange} className="w-4 h-4" />
                        <span className="text-xs text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.jenis_kelamin && <p className="text-xs text-red-500 mt-1">{errors.jenis_kelamin}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase">Usia <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {[{ value: "Semua", label: "Semua" }, { value: "Anak", label: "Anak" }, { value: "Dewasa", label: "Dewasa" }].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="usia" value={option.value} checked={formData.usia === option.value} onChange={handleFormChange} className="w-4 h-4" />
                        <span className="text-xs text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.usia && <p className="text-xs text-red-500 mt-1">{errors.usia}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase">Penyakit <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    {[{ value: "Semua", label: "Semua" }, { value: "Infeksius", label: "Infeksius" }, { value: "Non-Infeksius", label: "Non-Infeksius" }].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="penyakit" value={option.value} checked={formData.penyakit === option.value} onChange={handleFormChange} className="w-4 h-4" />
                        <span className="text-xs text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.penyakit && <p className="text-xs text-red-500 mt-1">{errors.penyakit}</p>}
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button type="button" onClick={resetForm} className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium text-sm cursor-pointer">
                    Batal
                  </button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm cursor-pointer disabled:opacity-50">
                    {submitting ? "Menyimpan..." : editingRoom ? "Simpan Perubahan" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedRoom ? (
            <div className="flex-1 bg-white rounded-lg p-6 overflow-y-auto">
              {/* HEADER */}
              <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-gray-800">{selectedRoom.nama_ruangan}</h2>
                  <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    selectedRoom.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {selectedRoom.is_active ? "Aktif" : "Non-Aktif"}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(selectedRoom)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium cursor-pointer border-none transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium cursor-pointer border-none transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              {/* INFO GRID */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Harga</div>
                  <div className="text-base font-bold text-gray-800">
                    Rp {Number(selectedRoom.harga_ruangan || 0).toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Kelas</div>
                  <div className="text-base font-bold text-gray-800">
                    {kelasOptions.find((k) => String(k.value) === String(selectedRoom.id_kelas_ruangan))?.label || selectedRoom.kelas || "-"}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Jenis Kelamin</div>
                  <div className="text-base font-bold text-gray-800">{selectedRoom.jenis_kelamin || "-"}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Usia</div>
                  <div className="text-base font-bold text-gray-800">{selectedRoom.usia || "-"}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Penyakit</div>
                  <div className="text-base font-bold text-gray-800">{selectedRoom.penyakit || "-"}</div>
                </div>
              </div>

              {/* FASILITAS */}
              {selectedRoom.fasilitas_ruangan && (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Fasilitas</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedRoom.fasilitas_ruangan).filter(([, v]) => v).map(([key]) => (
                      <span key={key} className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full">
                        {key.replace(/_/g, " ")}
                      </span>
                    ))}
                    {Object.values(selectedRoom.fasilitas_ruangan).filter(Boolean).length === 0 && (
                      <span className="text-xs text-gray-400 italic">Tidak ada fasilitas</span>
                    )}
                  </div>
                </div>
              )}

              {/* ACTION */}
              {isAdmin && (
                <div className="mt-6 pt-4" style={{ borderTop: "1px solid #e5e7eb" }}>
                {isAdmin && <AktifkanButton onClick={() => setShowConfirmModal(true)} />}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center" style={{ flex: "0 0 55%", backgroundColor: "#ffffff", borderRadius: "8px", padding: "40px" }}>
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="20" width="55" height="50" rx="4" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="1.5" />
                  <circle cx="28" cy="28" r="2.5" fill="#bbb" />
                  <circle cx="35" cy="28" r="2.5" fill="#bbb" />
                  <circle cx="42" cy="28" r="2.5" fill="#555" />
                  <rect x="28" y="38" width="35" height="3" rx="1.5" fill="#ccc" />
                  <rect x="28" y="45" width="28" height="3" rx="1.5" fill="#ccc" />
                  <rect x="28" y="52" width="32" height="3" rx="1.5" fill="#ccc" />
                  <path d="M62 50 C62 48 64 47 65 48 L67 50 L67 45 C67 43.5 69 43 69.5 44.5 L70 47 L70 43 C70 41.5 72 41 72.5 42.5 L73 46 L73 44 C73 42.5 75 42 75.5 43.5 L76 48 L76 58 C76 62 73 65 69 65 L65 65 C62 65 60 62 60 59 L60 53 C60 51 61.5 50 62 50 Z" fill="#d5d5d5" stroke="#bbb" strokeWidth="1" />
                </svg>
                <p style={{ marginTop: "20px", fontSize: "13px", color: "#888888", textAlign: "center", maxWidth: "500px", lineHeight: 1.6 }}>
                  Silahkan memilih kategori ruangan untuk melihat, mengubah, menghapus, mengarsipkan, dan mengaktifkan data kategori ruangan. Silahkan klik tombol <span style={{ textDecoration: "underline" }}>tambah</span> untuk menambahkan kategori ruangan baru.
                </p>
              </div>
              <div style={{ flex: "0 0 calc(45% - 8px)", marginTop: "8px", backgroundColor: "#f0f0f0", borderRadius: "8px" }} />
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden lg:pl-[70px]" style={{ paddingTop: "56px" }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#e8e8e8" }}>
          {content}
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500 lg:pl-[70px]">
        2026 (c) PT Medeva Multi Talenta
      </footer>

      {/* MODAL KONFIRMASI STATUS */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[400px]" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5" style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#333" }}>KONFIRMASI STATUS</h2>
              <button onClick={() => setShowConfirmModal(false)} style={{ fontSize: "18px", color: "#555", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "24px", textAlign: "left" }}>
              Apakah Anda yakin ingin <strong style={{ fontWeight: 700, color: "#333" }}>aktifkan</strong> kategori ?
            </p>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid #e0e0e0" }}>
              <button onClick={() => setShowConfirmModal(false)} className="px-6 py-2 rounded-md text-sm font-medium cursor-pointer" style={{ border: "1px solid #e53e3e", background: "transparent", color: "#e53e3e" }}>
                Batal
              </button>
              <button onClick={handleToggleActive} className="px-6 py-2 rounded-md text-sm font-semibold cursor-pointer" style={{ border: "none", background: "#3b82f6", color: "#fff" }}>
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[400px]" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5" style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#333" }}>KONFIRMASI HAPUS</h2>
              <button onClick={() => setShowDeleteModal(false)} style={{ fontSize: "18px", color: "#555", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "24px", textAlign: "left" }}>
              Apakah Anda yakin ingin menghapus kategori <strong style={{ fontWeight: 700, color: "#333" }}>{selectedRoom?.nama_ruangan}</strong> ?
            </p>
            <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid #e0e0e0" }}>
              <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 rounded-md text-sm font-medium cursor-pointer" style={{ border: "1px solid #888", background: "transparent", color: "#666" }}>
                Batal
              </button>
              <button onClick={handleDeleteRoom} className="px-6 py-2 rounded-md text-sm font-semibold cursor-pointer" style={{ border: "none", background: "#ef4444", color: "#fff" }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
