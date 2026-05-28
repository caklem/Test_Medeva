function AktifkanButton({ onClick, isActive }) {
  const label = isActive ? "Nonaktifkan" : "Aktifkan";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center bg-white border border-gray-300 rounded-lg cursor-pointer"
      style={{
        padding: "10px 16px",
        gap: "10px",
        width: "fit-content",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {isActive ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="16" height="10" rx="1" stroke="#ef4444" strokeWidth="2" fill="white" />
          <line x1="8" y1="15" x2="16" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="16" height="10" rx="1" stroke="#333333" strokeWidth="2" fill="white" />
          <path d="M4 10H8L10 14H14L16 10H20" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10L10 14H14L16 10" fill="#d4d4d4" stroke="none" />
        </svg>
      )}

      <span
        style={{
          fontSize: "15px",
          fontWeight: 500,
          color: isActive ? "#ef4444" : "#1e293b",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default AktifkanButton;
