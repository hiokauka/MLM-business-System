import React, { useState, useEffect } from "react";
import "../style/jana.css"; // Make sure your CSS is correct
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import DrawerAdmin from "./DrawerAdmin";
import MenuIcon from "@mui/icons-material/Menu";

function Jana() {
  const location = useLocation();
  const [randomNumber, setRandomNumber] = useState("");
  const [nomborpin, setNomborPin] = useState([]);
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => {
    setOpenDrawer(open);  // This will open or close the drawer
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      console.log("Admin logged out"); // Replace with actual logout logic
      localStorage.removeItem("adminSession");

      window.location.href = "/login"; // Redirect to login page
    }
  };

  useEffect(() => {
    fetchPins(); // Fetch existing pins from Supabase when the page loads
  }, []);

  // Fetch all pins from Supabase
  const fetchPins = async () => {
    const { data, error } = await supabase
      .from("pins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Gagal mendapatkan data PIN:", error);
    } else {
      setNomborPin(data);
    }
  };

  // Generate and insert new PIN into Supabase
  const generateRandomNumber = async () => {
    const newPin = Math.floor(10000 + Math.random() * 90000); // 5-digit PIN
    setRandomNumber(newPin);

    const loggedInUser = localStorage.getItem("loggedInUser"); // Simulated phone number
    const today = new Date().toISOString(); // Current timestamp


    const { error } = await supabase.from("pins").insert([
      { pin: newPin, phone: null, created_at: today },
    ]);

    if (error) {
      console.error("❌ Gagal menyimpan PIN:", error);
      alert("Gagal menyimpan PIN!");
    } else {
      alert("✅ Nombor PIN berjaya dihasilkan!");
      fetchPins(); // Fetch updated pins after inserting a new one
    }
  };

  // Filter pins based on search input
  const filteredpin = nomborpin.filter(
    (pin) =>
      pin.pin.toString().includes(search) ||
      pin.phone_number.includes(search)
  );

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
            <li><Link to="/total" className={location.pathname === "/total" ? "active" : ""}>Jumlah pengguna</Link></li>
            <li><Link to="/pin" className={location.pathname === "/pin" ? "active" : ""}>Jana Pin</Link></li>
            <li><Link to="/inquiry" className={location.pathname === "/inquiry" ? "active" : ""}>Permintaan Pengeluaran</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <LogoutIcon />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <DrawerAdmin openDrawer={openDrawer} toggleDrawer={toggleDrawer} handleLogout={handleLogout} />

      <div className="container-display">
        <h2>{randomNumber}</h2>
        <button onClick={generateRandomNumber}>Hasilkan Nombor PIN</button>
      </div>

      <div className="jana-filters">
        <input
          type="text"
          placeholder="Carian nombor pin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="jana-table-container">
        <div className="table-wrapper1">
          <table>
            <thead>
              <tr>
                <th>Nombor Pin</th>
                <th>Nombor berdaftar</th>
                <th>Tarikh berdaftar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredpin.length > 0 ? (
                filteredpin.map((pin, index) => (
                  <tr key={index}>
                    <td>{pin.pin}</td>
                    <td>{pin.phone}</td>
                    <td>{new Date(pin.created_at).toLocaleDateString("en-GB")}</td>
                    <td>{pin.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Tiada rekod ditemui</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Jana;
