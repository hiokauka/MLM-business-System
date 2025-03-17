import React from "react";
import "../style/Admin.css";  // ✅ Ensure you have a CSS file
import { Link, useLocation } from "react-router-dom";

function Admin() {
  const location = useLocation();
  
    return (
    <div>
      <header className="header">
        <img src="/assets/Logo.png" className="logo" />
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/total" className={location.pathname === "/total" ? "active" : ""}>
                Jumlah pengguna
              </Link>
            </li>
            <li>
              <Link to="/pin" className={location.pathname === "/pin" ? "active" : ""}>
                Jana Pin
              </Link>
            </li>
            <li>
              <Link to="/inquiry" className={location.pathname === "/inquiry" ? "active" : ""}>
                Permintaan Pengeluaran
              </Link>
            </li>
          
          
          </ul>
        </nav>
      </header>
  
      <main>
        <h1>
          Admin Page
        </h1>
      </main>
  
  
    </div>
    );
  }

export default Admin;