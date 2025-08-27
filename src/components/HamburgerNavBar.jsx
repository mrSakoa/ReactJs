import { useState } from "react";

export default function HamburgerNavbar() {
  const [open, setOpen] = useState(false);
  const items = ["Home", "About", "Services", "Pricing", "Contact"];

  return (
    <header style={{

      position: "relative",
      width: "100%",
      background: "#858585",
      padding: "10px",
      
    }}>

      <nav style={{

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "centered",

      }}>
        <div style={{
          fontWeight: "bold",
        }}>

          Hamburger NavBar

          </div>
        <button
          onClick={() => setOpen(!open)}
          style={{

            background: "#858585",
            fontSize: "20px",
            cursor: "pointer",
            border: "none",
            outline: "none",

          }}>

          {open ? "✖" : "☰"}

        </button>
      </nav>

      {open && (
        <ul
          style={{

            listStyle: "none",
            background: "#858585",
            position: "centered",
            top: "50px",
            width: "85%",

          }}>

          {items.map((label) => (
            <li key={label} style={{

              padding: "5px 0",
              borderTop: "1px solid #e4e4e4"

            }}>
              <a href="#" style={{

                textDecoration: "none",
                color: "black",

              }}>{label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}