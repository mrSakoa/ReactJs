import { useState } from "react";
import { Link } from "react-router-dom";

export default function HamburgerNavbar() {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "Welcome", to: "/" },
    { label: "Bulls & Cows", to: "/bullsnCows" },
    { label: "High Score", to: "/highScore" },
  ];

  return (
    <header
      style={{
        position: "relative",
        width: "100%",
        height: "40px",
        background: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0))",
        padding: "10px 20px",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "26px" }}>CTRL + Style</div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
            border: "none",
            outline: "none",
            lineHeight: 1,
            marginRight: "2%",
            padding: "10px",
            color: "rgb(0, 255, 0)",
          }}
        >
          {open ? "X" : "☰"}
        </button>
      </nav>

      {open && (
        <div
          style={{
            margin: "10px auto 0",
            background: "rgba(43, 43, 43, 1)",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "35px",
            width: "85%",
            zIndex: 10,
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          {items.map(({ label, to }, idx) => (
            <div
              key={`${to}-${idx}`}
            >
              <Link
                to={to}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  color: "rgb(0, 255, 0)",
                  textAlign: "center",
                }}
              >
                {label}
              </Link>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
