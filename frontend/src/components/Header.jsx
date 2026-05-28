import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Header({ onToggleSidebar }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.nama_lengkap || "User";
  const displayRole = user.is_admin ? "(Admin)" : "(User)";
  const displayEmail = user.email || `${user.username}@medeva.com`;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      className="flex items-center justify-between w-full"
      style={{
        height: "56px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        paddingLeft: "24px",
        paddingRight: "24px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      {/* LEFT */}
      <button onClick={onToggleSidebar} className="md:hidden flex items-center justify-center p-1 cursor-pointer border-none bg-transparent">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="hidden md:block" style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>
        Klinik Sjamsudin Noor
      </div>

      {/* CENTER — LOGO */}
      <div
        className="flex items-center justify-center"
        style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="flex items-center" style={{ gap: "8px" }}>
          {/* LOGO ICON */}
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#2dd4bf",
              maskImage: "url(/img/medeva_icon1.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url(/img/medeva_icon1.png)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
          {/* VERTICAL DIVIDER */}
          <div style={{ width: "1px", height: "24px", backgroundColor: "#2dd4bf" }} />
          {/* TEXT LOGO */}
          <div className="flex items-center" style={{ gap: "4px" }}>
            <span style={{ fontSize: "16px", fontWeight: 400, color: "#374151" }}>Medeva</span>
            <span style={{ fontSize: "16px", fontWeight: 400, color: "#2dd4bf" }}>Mint</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center" style={{ gap: "16px" }}>
        {/* NOTIF BELL */}
        <div className="relative" style={{ width: "20px", height: "20px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className="absolute flex items-center justify-center" style={{ top: "-4px", right: "-4px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#ef4444", fontSize: "9px", fontWeight: 700, color: "#ffffff" }}>
            9
          </div>
        </div>

        {/* USER INFO + LOGOUT */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center cursor-pointer bg-transparent border-none"
            style={{ gap: "10px" }}
          >
            <div className="hidden md:block" style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#333333" }}>{displayName}</div>
              <div style={{ fontSize: "11px", fontWeight: 400, color: "#888888" }}>{displayRole}</div>
            </div>
            <div className="flex items-center justify-center" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#4a5568", border: "2px solid #e5e7eb", overflow: "hidden" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </button>

          {/* DROPDOWN */}
          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg z-50"
              style={{ width: "180px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}>{displayName}</div>
                <div style={{ fontSize: "10px", color: "#888" }}>{displayEmail}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer border-none transition-colors rounded-b-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
