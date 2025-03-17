import React, { useState, useEffect } from "react";
import "../style/total.css";  
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient"; 
import DrawerAdmin from "./DrawerAdmin";
import MenuIcon from "@mui/icons-material/Menu";

function Total() {
    const location = useLocation();
    const [totalUsers, setTotalUsers] = useState(0); 
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = (open) => {
        setOpenDrawer(open);  
    };

    useEffect(() => {
        const fetchTotalUsers = async () => {
            const { count, error } = await supabase
                .from("users")
                .select("id", { count: "exact" });

            if (error) {
                console.error("Error fetching total users:", error);
                return;
            }

            setTotalUsers(count || 0);
        };

        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("name, pin, phone, bank_account, bank_name, total_bonus, alamat, ic");

            if (error) {
                console.error("Error fetching users:", error);
                return;
            }

            setUsers(data || []);
        };

        fetchTotalUsers();
        fetchUsers();
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
        if (confirmLogout) {
            localStorage.removeItem("adminSession");
            window.location.href = "/login"; 
        }
    };

    const filteredUsers = users.filter((user) => {
        return (
            (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
            (user.pin && user.pin.includes(search)) ||
            (user.phone && user.phone.includes(search)) ||
            (user.bank_account && user.bank_account.includes(search)) ||
            (user.bank_name && user.bank_name.toLowerCase().includes(search)) ||
            (user.total_bonus && user.total_bonus.toString().includes(search)) ||
            (user.alamat && user.alamat.toLowerCase().includes(search)) || 
            (user.ic && user.ic.includes(search)) 
        );
    });

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

            <div className="card">
                <div className="text1"><h1>Jumlah Pengguna</h1></div>
                <div className="text2"><h2>{totalUsers}</h2></div>
            </div>

            <div className="total-filters">
                <input
                    type="text"
                    placeholder="Carian nama, pin, no telefon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="tablecard">
                <div className="total-tablecontainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Pin</th>
                                <th>Nombor Telefon</th>
                                <th>Akaun Bank</th>
                                <th>Nama Bank</th>
                                <th>Jumlah Bonus</th>
                                <th>Alamat</th>  
                                <th>No IC</th>  
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>{user.pin}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.bank_account}</td>
                                        <td>{user.bank_name}</td>
                                        <td>{user.total_bonus}</td>
                                        <td>{user.alamat}</td>
                                        <td>{user.ic}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">Tiada rekod ditemui</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Total;
