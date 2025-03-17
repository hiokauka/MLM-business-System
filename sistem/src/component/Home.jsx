import React, { useState } from "react";
import "../style/Home.css";  // ✅ Ensure you have a CSS file
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";

function Home() {

  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      console.log("User logged out"); // Replace with actual logout logic
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login"; // Redirect to login page
    }
  };

  const toggleDrawer = (open) => {
    setOpenDrawer(open);  // This will open or close the drawer
  };


  return (
    <div>
      <header className="header">
        <img src="/assets/Logo.png" className="logo" />

        {/* Hamburger Menu for Small Screens */}
        <MenuIcon
          className="hamburger"
          onClick={() => toggleDrawer(true)}  // Open the drawer when the icon is clicked
          style={{ fontSize: 30, cursor: 'pointer', display: 'none' }} // Initially hidden on larger screens
        />

        <nav className="navbar">
          <ul>
            <li>
              <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
                Utama
              </Link>
            </li>
            <li>
              <Link to="/bonus" className={location.pathname === "/bonus" ? "active" : ""}>
                Bonus
              </Link>
            </li>
            <li>
              <Link to="/rangkaian" className={location.pathname === "/rangkaian" ? "active" : ""}>
                Rangkaian anda
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
                Hubungi kami
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <LogoutIcon />
              </button>

            </li>

          </ul>
        </nav>
      </header>

      <DrawerComponent openDrawer={openDrawer} toggleDrawer={toggleDrawer} handleLogout={handleLogout} />

      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-content">
          <h1>💰 Jana Pendapatan & Kekal Sihat! 💊</h1>
          <p>
            Hanya dengan <strong>RM100</strong>, anda boleh memulakan perniagaan anda sendiri
            & menikmati pelbagai bonus menarik.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="info-card">
        <h2>Kenapa Pilih Kami?</h2>
        <p>✔ Modal rendah | ✔ Produk berkualiti | ✔ Bonus lumayan</p>
      </section>

      <img src="/assets/ubat.jpg" alt="Produk Vitamin" className="ubat-image" />


    </div>
  );
}

export default Home;