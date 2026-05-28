import { useState, useEffect } from "react";
import * as yup from "yup";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AktifkanButton from "@/components/AktifkanButton";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/utils/formatCurrency";

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isAdmin } = useAuth();

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
  }, [page, perPage, search, activeFilter, refreshKey]);

  const [kelasList, setKelasList] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await api.get("/kelas-ruangan");
        if (!ignore) setKelasList(res.data.data || []);
      } catch {
        if (!ignore) setKelasList([]);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const kelasOptions = kelasList.map((k) => ({ value: k.id, label: k.nama_kelas }));

  const totalPages = Math.ceil(total / perPage) || 1;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHargaChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, harga_ruangan: raw }));
  };

  const displayHarga = formatCurrency(formData.harga_ruangan);

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
      id_kelas_ruangan: room.id_kelas_ruangan || "",
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
      id_kelas_ruangan: formData.id_kelas_ruangan,
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
      setRefreshKey((k) => k + 1);
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan data";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async () => {
    const target = selectedRoom || editingRoom;
    if (!target) return;
    const newStatus = !target.is_active;
    try {
      await api.put(`/kategori-ruangan/${target.id}`, {
        is_active: newStatus,
      });
      setSelectedRoom((prev) => prev ? { ...prev, is_active: newStatus } : null);
      if (editingRoom) {
        setEditingRoom((prev) => prev ? { ...prev, is_active: newStatus } : null);
      }
      setShowConfirmModal(false);
      setRefreshKey((k) => k + 1);
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

  const renderForm = () => (
    <div className="bg-white rounded-lg p-6 overflow-y-auto">
      <div className="flex items-start justify-between" style={{ marginBottom: "4px" }}>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowForm(false); setEditingRoom(null); }} className="lg:hidden mr-1 p-1 rounded hover:bg-gray-100 cursor-pointer border-none bg-transparent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a1a", margin: 0, letterSpacing: "normal" }}>
            FORM {editingRoom ? "EDIT" : "TAMBAH"} KATEGORI RUANGAN
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            border: "1px solid #d1d5db", borderRadius: "8px",
            padding: "8px 16px", backgroundColor: "#fff",
            cursor: "pointer", position: "relative",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect x="1" y="3" width="22" height="5" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#333333" }}>{editingRoom?.is_active ? "Nonaktifkan" : "Aktifkan"}</span>
          <div style={{ position: "absolute", right: 0, top: 0, width: "3px", height: "100%", backgroundColor: "#ef4444", borderRadius: "0 8px 8px 0" }} />
        </button>
      </div>

      <p style={{ margin: "4px 0 24px 0", fontSize: "12px", fontWeight: 400, color: "#ef4444" }}>
        <span style={{ color: "#ef4444" }}>*</span><span style={{ color: "#ef4444" }}>) Wajib diisi</span>
      </p>

      <form onSubmit={handleSubmitForm}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "#fff", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#333", marginBottom: "20px", letterSpacing: "0.5px" }}>INFORMASI RUANGAN</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "8px" }}>
                Nama / Nomor Ruangan <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="nama_ruangan"
                value={formData.nama_ruangan}
                onChange={handleFormChange}
                placeholder="Nama / Nomor Ruangan"
                style={{ width: "100%", height: "40px", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" }}
              />
              {errors.nama_ruangan && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.nama_ruangan}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "8px" }}>
                Kelas <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                name="id_kelas_ruangan"
                value={formData.id_kelas_ruangan}
                onChange={handleFormChange}
                style={{ width: "100%", height: "40px", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", outline: "none", backgroundColor: "#fff", color: formData.id_kelas_ruangan ? "#333" : "#9ca3af", appearance: "auto" }}
              >
                <option value="" disabled>Select...</option>
                {kelasOptions.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
              {errors.id_kelas_ruangan && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.id_kelas_ruangan}</p>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginTop: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "8px" }}>
                Jumlah Kamar <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                name="jumlah_kamar"
                value={formData.jumlah_kamar}
                onChange={handleFormChange}
                placeholder="0"
                style={{ width: "100%", height: "40px", border: "1px solid #d1d5db", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" }}
                min="0"
              />
              {errors.jumlah_kamar && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.jumlah_kamar}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "8px" }}>
                Harga Ruangan <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ display: "flex" }}>
                <span style={{ backgroundColor: "#f3f4f6", padding: "8px 12px", border: "1px solid #d1d5db", borderRight: "none", borderRadius: "6px 0 0 6px", fontSize: "13px", color: "#6b7280", lineHeight: "24px" }}>Rp</span>
                <input
                  type="text"
                  name="harga_ruangan"
                  value={displayHarga}
                  onChange={handleHargaChange}
                  placeholder="0"
                  style={{ flex: 1, height: "40px", border: "1px solid #d1d5db", borderLeft: "none", borderRadius: "0 6px 6px 0", padding: "8px 12px", fontSize: "13px", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" }}
                />
              </div>
              {errors.harga_ruangan && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.harga_ruangan}</p>}
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "#fff", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#333", marginBottom: "20px", letterSpacing: "0.5px" }}>INFORMASI RUANGAN</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "16px 24px" }}>
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
              <label key={facility.key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={facilities[facility.key]}
                  onChange={() => handleFacilityChange(facility.key)}
                  style={{ width: "16px", height: "16px", border: "1.5px solid #d1d5db", borderRadius: "3px", margin: 0, accentColor: "#3b82f6" }}
                />
                <span style={{ fontSize: "13px", fontWeight: 400, color: "#555" }}>{facility.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", backgroundColor: "#fff", marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#333", marginBottom: "20px", letterSpacing: "0.5px" }}>INFORMASI RUANGAN</div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "10px" }}>
              Jenis Kelamin <span style={{ color: "#ef4444" }}>*</span>
            </div>
            <div className="flex flex-wrap" style={{ gap: "24px" }}>
              {["Semua", "Laki-laki", "Perempuan"].map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 400, color: "#555" }}>
                  <input type="radio" name="jenis_kelamin" value={opt} checked={formData.jenis_kelamin === opt} onChange={handleFormChange} style={{ width: "16px", height: "16px", border: "1.5px solid #d1d5db", margin: 0, accentColor: "#3b82f6" }} />
                  {opt}
                </label>
              ))}
            </div>
            {errors.jenis_kelamin && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.jenis_kelamin}</p>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "10px" }}>
              Usia <span style={{ color: "#ef4444" }}>*</span>
            </div>
            <div className="flex flex-wrap" style={{ gap: "24px" }}>
              {["Semua", "Anak", "Dewasa"].map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 400, color: "#555" }}>
                  <input type="radio" name="usia" value={opt} checked={formData.usia === opt} onChange={handleFormChange} style={{ width: "16px", height: "16px", border: "1.5px solid #d1d5db", margin: 0, accentColor: "#3b82f6" }} />
                  {opt}
                </label>
              ))}
            </div>
            {errors.usia && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.usia}</p>}
          </div>

          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "10px" }}>
              Penyakit <span style={{ color: "#ef4444" }}>*</span>
            </div>
            <div className="flex flex-wrap" style={{ gap: "24px" }}>
              {["Semua", "Infeksius", "Non-Infeksius"].map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 400, color: "#555" }}>
                  <input type="radio" name="penyakit" value={opt} checked={formData.penyakit === opt} onChange={handleFormChange} style={{ width: "16px", height: "16px", border: "1.5px solid #d1d5db", margin: 0, accentColor: "#3b82f6" }} />
                  {opt}
                </label>
              ))}
            </div>
            {errors.penyakit && <p style={{ fontSize: "11px", color: "#ef4444", margin: "4px 0 0 0" }}>{errors.penyakit}</p>}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button type="button" onClick={resetForm} style={{ padding: "8px 24px", border: "1px solid #ef4444", borderRadius: "6px", backgroundColor: "#fff", color: "#ef4444", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#fef2f2"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#fff"}
          >Batal</button>
          <button type="submit" disabled={submitting} style={{ padding: "8px 24px", border: "none", borderRadius: "6px", backgroundColor: "#3b82f6", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
            onMouseEnter={(e) => { if (!submitting) e.target.style.backgroundColor = "#2563eb"; }}
            onMouseLeave={(e) => { if (!submitting) e.target.style.backgroundColor = "#3b82f6"; }}
          >{submitting ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  );

  const renderDetail = () => (
    <div className="bg-white p-4 sm:p-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setSelectedRoom(null)} className="lg:hidden shrink-0 p-1 rounded hover:bg-gray-100 cursor-pointer border-none bg-transparent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate">{selectedRoom.nama_ruangan}</h2>
          <span className={`shrink-0 inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full ${
            selectedRoom.is_active ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {selectedRoom.is_active ? "Aktif" : "Non-Aktif"}
          </span>
        </div>
        {isAdmin && (
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button onClick={() => openEditForm(selectedRoom)} className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs sm:text-sm font-medium cursor-pointer border-none transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs sm:text-sm font-medium cursor-pointer border-none transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="hidden sm:inline">Hapus</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Harga</div>
          <div className="text-sm sm:text-base font-bold text-gray-800">Rp {formatCurrency(selectedRoom.harga_ruangan) || "0"}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Kelas</div>
          <div className="text-sm sm:text-base font-bold text-gray-800">
            {kelasOptions.find((k) => String(k.value) === String(selectedRoom.id_kelas_ruangan))?.label || selectedRoom.kelas || "-"}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Jenis Kelamin</div>
          <div className="text-sm sm:text-base font-bold text-gray-800">{selectedRoom.jenis_kelamin || "-"}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Usia</div>
          <div className="text-sm sm:text-base font-bold text-gray-800">{selectedRoom.usia || "-"}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sm:col-span-2">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Penyakit</div>
          <div className="text-sm sm:text-base font-bold text-gray-800">{selectedRoom.penyakit || "-"}</div>
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Fasilitas</div>
        <div className="flex flex-wrap gap-2">
          {selectedRoom.fasilitas_ruangan && Object.entries(selectedRoom.fasilitas_ruangan).filter(([, v]) => v).map(([key]) => (
            <span key={key} className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{key}</span>
          ))}
          {(!selectedRoom.fasilitas_ruangan || Object.keys(selectedRoom.fasilitas_ruangan).length === 0) && (
            <span className="text-xs text-gray-400">Tidak ada fasilitas</span>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4" style={{ borderTop: "1px solid #e5e7eb" }}>
          <AktifkanButton onClick={() => setShowConfirmModal(true)} isActive={selectedRoom?.is_active} />
        </div>
      )}
    </div>
  );

  const renderPlaceholder = () => (
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
          Silahkan memilih harga obat untuk melihat, mengubah, menghapus, mengarsipkan, dan mengaktifkan data harga obat. Silahkan klik tombol <span style={{ textDecoration: "underline" }}>tambah</span> untuk menambahkan harga obat baru.
        </p>
      </div>
      <div style={{ flex: "0 0 calc(45% - 8px)", marginTop: "8px", backgroundColor: "#f0f0f0", borderRadius: "8px" }} />
    </>
  );

  const content = (
    <>
      {/* BREADCRUMB */}
      <div style={{ paddingLeft: "16px", paddingTop: "12px", paddingBottom: "8px", fontSize: "13px", fontWeight: 400, color: "#8b9dc3" }}>
        Rawat Inap / Pengaturan Kategori Ruangan
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-[340px] lg:min-w-[340px]" style={{ backgroundColor: "#ffffff", borderRadius: "8px", margin: "8px 0 8px 8px", padding: "24px" }}>
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
          <div style={{ marginTop: "20px", overflowX: "auto" }}>
            <div className="flex" style={{ borderBottom: "1px solid #e0e0e0", padding: "10px 0", minWidth: "400px" }}>
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
                        <div>Harga: Rp {formatCurrency(room.harga_ruangan) || "0"}</div>
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

        {/* RIGHT PANEL — DESKTOP ONLY */}
        <div className="hidden lg:flex lg:flex-col flex-1 min-w-0" style={{ margin: "8px 8px 8px 8px" }}>
          {showForm ? renderForm() : selectedRoom ? renderDetail() : renderPlaceholder()}
        </div>
      </div>

      {/* MOBILE PLACEHOLDER — shown inline when no form/detail */}
      {!showForm && !selectedRoom && (
        <div className="lg:hidden" style={{ margin: "0 8px 8px 8px" }}>
          {renderPlaceholder()}
        </div>
      )}

      {/* MOBILE FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto" style={{ top: "56px" }}>
          {renderForm()}
        </div>
      )}

      {/* MOBILE DETAIL MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto" style={{ top: "56px" }}>
          {renderDetail()}
        </div>
      )}
    </>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />

      <div className="flex flex-1 overflow-hidden lg:pl-[70px]" style={{ paddingTop: "56px" }}>
        <Sidebar sidebarOpen={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)} />
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
              Apakah Anda yakin ingin <strong style={{ fontWeight: 700, color: "#333" }}>{(selectedRoom || editingRoom)?.is_active ? "nonaktifkan" : "aktifkan"}</strong> kategori ?
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
