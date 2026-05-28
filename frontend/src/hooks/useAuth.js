export function useAuth() {
  const raw = localStorage.getItem("user") || "{}";
  let user;
  try { user = JSON.parse(raw); } catch { user = {}; }

  return {
    user,
    isAdmin: user.is_admin === true,
    namaLengkap: user.nama_lengkap || "",
  };
}
