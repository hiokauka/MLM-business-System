import React, { useState, useEffect } from "react";
import "../style/Settings.css";  // Ensure you have a CSS file
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";
import supabase from "../config/supabaseClient";

function Settings() {
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      console.log("User logged out");
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login"; // Redirect to login page
    }
  };

  const toggleDrawer = (open) => {
    setOpenDrawer(open);  // This will open or close the drawer
  };

  const [userData, setUserData] = useState({
    username: "",
    name: "",
    icNumber: "",
    pinNumber: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    oldPhone: "", // Store the old phone number here
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");

      if (!loggedInUser) {
        alert("No user found, please log in.");
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("users") // Your table name
        .select("username, name, ic, pin, phone, bank_name, bank_account")
        .eq("username", loggedInUser)
        .single(); // Expecting only one result

      if (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      } else {
        setUserData({
          username: data.username,
          name: data.name,
          icNumber: data.ic,  // Correct field name from the response
          pinNumber: data.pin,
          phone: data.phone,
          oldPhone: data.phone, // Set oldPhone to the current phone
          bankName: data.bank_name,
          bankAccount: data.bank_account,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // First, update the phone number in the 'pins' table
      const { error: pinUpdateError } = await supabase
        .from("pins")
        .update({ phone: userData.phone }) // Update the phone in the 'pins' table
        .eq("phone", userData.oldPhone); // Match the old phone number

      if (pinUpdateError) {
        throw pinUpdateError; // If there's an error in updating the pins, throw it
      }

      // Now, update the user data in the 'users' table
      const { error } = await supabase
        .from("users")
        .update({
          phone: userData.phone,
          bank_name: userData.bankName,
          bank_account: userData.bankAccount,
          ic: userData.icNumber,
        })
        .eq("username", userData.username);

      if (error) {
        throw error; // Throw error if there's a problem updating the user data
      }

      alert("Maklumat berjaya dikemaskini!"); // Success message
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Gagal kemaskini maklumat! Sila cuba lagi."); // Error message
    }
  };

  return (
    <div>
      <header className="header">
        <img src="/assets/Logo.png" className="logo" />
        <MenuIcon
          className="hamburger"
          onClick={() => toggleDrawer(true)}
          style={{ fontSize: 30, cursor: 'pointer', display: 'none' }}
        />
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Utama</Link>
            </li>
            <li>
              <Link to="/bonus" className={location.pathname === "/bonus" ? "active" : ""}>Bonus</Link>
            </li>
            <li>
              <Link to="/rangkaian" className={location.pathname === "/rangkaian" ? "active" : ""}>Rangkaian anda</Link>
            </li>
            <li>
              <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>Tetapan</Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Hubungi kami</Link>
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

      <div className="settings-container">
        <h2>Tetapan</h2>
        <form>
          <label>Username</label>
          <input type="text" name="username" value={userData.username} readOnly />

          <label>Nama Penuh</label>
          <input type="text" name="name" value={userData.name} readOnly />

          <label>Nombor IC</label>
          <input type="text" name="icNumber" value={userData.icNumber} onChange={handleChange} />

          <label>Pin</label>
          <input type="text" name="pinNumber" value={userData.pinNumber} readOnly />

          <label>Nombor Telefon</label>
          <input type="text" name="phone" value={userData.phone} readOnly />

          <label>Nama Bank</label>
          <input type="text" name="bankName" value={userData.bankName} onChange={handleChange} />

          <label>Nombor Akaun Bank</label>
          <input type="text" name="bankAccount" value={userData.bankAccount} onChange={handleChange} />

          <button className="submitchange" type="button" onClick={handleSave}>Simpan perubahan</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
