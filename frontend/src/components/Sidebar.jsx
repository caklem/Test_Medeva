import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

function Sidebar({ sidebarOpen, onCloseSidebar }) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const submenuRef = useRef(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (submenuRef.current && !submenuRef.current.contains(e.target)) {
        setShowSubmenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebarContent = (
    <>
      {/* MENU ITEM */}
      <div
        onClick={() => setShowSubmenu(!showSubmenu)}
        className="flex flex-col items-center px-2 py-3 rounded-lg cursor-pointer"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="1" />
          <line x1="8" y1="6" x2="10" y2="6" />
          <line x1="14" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="10" y2="10" />
          <line x1="14" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="10" y2="14" />
          <line x1="14" y1="14" x2="16" y2="14" />
          <rect x="9" y="18" width="6" height="4" />
        </svg>
        <span
          className="text-center mt-1"
          style={{ fontSize: "10px", color: "#3b82f6" }}
        >
          Rawat Inap
        </span>
      </div>

      {/* SUBMENU */}
      {showSubmenu && isAdmin && (
        <div
          ref={submenuRef}
          className="fixed z-50"
          style={{
            top: "132px",
            left: "78px",
            width: "220px",
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: "8px 0",
          }}
        >
          <button
            onClick={() => setShowSubmenu(false)}
            className="w-full flex items-center gap-[10px] px-4 py-[10px] cursor-pointer"
            style={{ background: "#f0f9ff" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M18 2l3 3-2 2-3-3z" />
              <line x1="16" y1="7" x2="19" y2="4" />
            </svg>
            <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: 500 }}>
              Pengaturan Ruangan
            </span>
          </button>
          <button
            onClick={() => setShowSubmenu(false)}
            className="w-full flex items-center gap-[10px] px-4 py-[10px] cursor-pointer"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M18 2l3 3-2 2-3-3z" />
              <line x1="16" y1="7" x2="19" y2="4" />
            </svg>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 400 }}>
              Pengaturan Kelas
            </span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => { onCloseSidebar(); setShowSubmenu(false); }}
        />
      )}

      {/* SIDEBAR — DESKTOP */}
      <aside className="fixed left-0 z-50 top-[56px] h-screen w-[70px] bg-white border-r flex flex-col items-center pt-4 hidden md:flex" style={{ borderColor: "#e0e0e0" }}>
        {sidebarContent}
      </aside>

      {/* SIDEBAR — MOBILE DRAWER */}
      {sidebarOpen && (
        <aside className="fixed left-0 z-50 top-[56px] h-screen w-[220px] bg-white border-r flex flex-col items-center pt-4 md:hidden" style={{ borderColor: "#e0e0e0", boxShadow: "4px 0 12px rgba(0,0,0,0.1)" }}>
          {sidebarContent}
        </aside>
      )}
    </>
  );
}

export default Sidebar;