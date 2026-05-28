function Header() {
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
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#1a1a1a",
        }}
      >
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
            <span style={{ fontSize: "16px", fontWeight: 400, color: "#374151" }}>
              Medeva
            </span>
            <span style={{ fontSize: "16px", fontWeight: 400, color: "#2dd4bf" }}>
              Mint
            </span>
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
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: "-4px",
              right: "-4px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              fontSize: "9px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            9
          </div>
        </div>

        {/* USER INFO */}
        <div className="flex items-center" style={{ gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#333333" }}>
              Tenaga Medis 197
            </div>
            <div style={{ fontSize: "11px", fontWeight: 400, color: "#888888" }}>
              (Dokter, Purchasing, Manager)
            </div>
          </div>

          {/* AVATAR */}
          <div
            className="flex items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#4a5568",
              border: "2px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;