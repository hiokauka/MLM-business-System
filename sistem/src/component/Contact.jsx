
import "../style/Contact.css";  // ✅ Ensure you have a CSS file
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";

function Home() {

  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (open) => {
    setOpenDrawer(open);  // This will open or close the drawer
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      console.log("User logged out"); // Replace with actual logout logic
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login"; // Redirect to login page
    }
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

      <div className="contact1">

        <h1 className="contact_phone">
          Admin - 01124297004
        </h1>

      </div>

      <div className="contact2">

        <h1 className="contact_email">
          Pusatpembangunanusahawan@gmail.com
        </h1>

      </div>


      <div className="contact3">

        <h1 className="contact_alamat">
          Menara Prestige, Exit, Jalan Pinang, 50450 Kuala Lumpur
          Tel : 010 2147671


        </h1>

      </div>



    </div>
  );
}

export default Home;