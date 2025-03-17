import React, { useState, useEffect } from "react";
import "../style/inquiry.css";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import DrawerAdmin from "./DrawerAdmin";
import MenuIcon from "@mui/icons-material/Menu";

function Inquiry() {
  const location = useLocation();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => {
    setOpenDrawer(open); 
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data: pending, error: pendingError } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("action", "pending"); 

    const { data: completed, error: completedError } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("action", "completed"); 

    if (pendingError) console.error("Error fetching pending withdrawals:", pendingError);
    if (completedError) console.error("Error fetching completed withdrawals:", completedError);

    setPendingRequests(pending || []);
    setCompletedRequests(completed || []);
  };

  const markAsComplete = async (id) => {
    const { error } = await supabase
      .from("withdrawals")
      .update({ action: "completed" }) 
      .eq("id", id);

    if (error) {
      console.error("Error updating withdrawal status:", error);
      return;
    }

    fetchRequests();
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      console.log("Admin logged out");
      localStorage.removeItem("adminSession");
      window.location.href = "/login";
    }
  };

  const filteredRequests = completedRequests.filter((req) =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div>
        <h2>Permintaan semasa</h2>
        <div className="table-wrapper">
          <table className="t1">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Bank</th>
                <th>Nombor Akaun</th>
                <th>Jumlah</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.name}</td>
                    <td>{req.bank_name}</td>
                    <td>{req.account_number}</td>
                    <td>RM {req.amount}</td>
                    <td>
                      <button onClick={() => markAsComplete(req.id)}>Tandakan Selesai</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Tiada permintaan semasa</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2>Permintaan Selesai</h2>

        <input

            className="input-for-c"
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-wrapper">
          <table className="t2">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Bank</th>
                <th>Nombor Akaun</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.name}</td>
                    <td>{req.bank_name}</td>
                    <td>{req.account_number}</td>
                    <td>RM {req.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Tiada permintaan selesai</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inquiry;
