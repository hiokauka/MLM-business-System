import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "../style/bonus.css";  // ✅ Ensure you have a CSS file
import supabase from "../config/supabaseClient";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";


function Bonus() {
    const location = useLocation();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [totalBonus, setTotalBonus] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    const toggleDrawer = (open) => {
        setOpenDrawer(open);  // This will open or close the drawer
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const loggedInUser = localStorage.getItem("loggedInUser");
            if (!loggedInUser) return;

            // Get user ID
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("id")
                .eq("username", loggedInUser)
                .single();

            if (userError || !userData) {
                console.error("Error fetching user ID:", userError);
                return;
            }

            // Fetch user's withdrawals
            const { data: withdrawals, error: withdrawalsError } = await supabase
                .from("withdrawals")
                .select("created_at, id, amount, action")
                .eq("user_id", userData.id)
                .order("created_at", { ascending: false }); // Show latest first

            if (withdrawalsError) {
                console.error("Error fetching withdrawals:", withdrawalsError);
            } else {
                setTransactions(withdrawals);
            }
        };

        fetchTransactions();
    }, []);

    const handleWithdraw = async () => {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (!loggedInUser) {
            window.alert("Sila log masuk terlebih dahulu!");
            return;
        }

        if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
            window.alert("Sila masukkan jumlah pengeluaran yang sah!");
            return;
        }

        const withdrawAmountNum = parseFloat(withdrawAmount);

        // ✅ Minimum withdrawal amount check
        if (withdrawAmountNum < 50) {
            window.alert("Jumlah pengeluaran minimum adalah RM50!");
            return;
        }

        // Fetch user details from the "users" table
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, name, bank_name, bank_account, total_bonus")
            .eq("username", loggedInUser)
            .single();

        if (userError || !userData) {
            window.alert("Gagal mendapatkan maklumat pengguna!");
            console.error(userError);
            return;
        }


        if (withdrawAmountNum > userData.total_bonus) {
            window.alert("Jumlah pengeluaran melebihi baki bonus anda!");
            return;
        }

        // Start a transaction (Simulating atomic operation)
        const { error: withdrawError } = await supabase
            .from("withdrawals")
            .insert([
                {
                    user_id: userData.id,
                    name: userData.name,
                    bank_name: userData.bank_name,
                    account_number: userData.bank_account,
                    amount: withdrawAmountNum,
                    action: "pending",
                    created_at: new Date().toISOString(),
                },
            ]);

        if (withdrawError) {
            window.alert("Gagal menghantar permohonan pengeluaran!");
            console.error(withdrawError);
            return;
        }

        // ✅ Now, deduct the amount from the user's total_bonus in the "users" table
        const newTotalBonus = userData.total_bonus - withdrawAmountNum;
        const { error: updateError } = await supabase
            .from("users")
            .update({ total_bonus: newTotalBonus })
            .eq("id", userData.id);

        if (updateError) {
            window.alert("Gagal mengemas kini baki bonus!");
            console.error(updateError);
            return;
        }

        // ✅ Fetch updated bonus from Supabase to ensure correctness
        const { data: updatedUserData, error: updatedUserError } = await supabase
            .from("users")
            .select("total_bonus")
            .eq("id", userData.id)
            .single();

        if (updatedUserError || !updatedUserData) {
            console.error("Failed to update displayed bonus:", updatedUserError);
        } else {
            setTotalBonus(updatedUserData.total_bonus);
        }

        window.alert("Permohonan pengeluaran berjaya dihantar!");
        setWithdrawAmount(""); // Clear input field
    };


    useEffect(() => {
        const fetchBonus = async () => {
            const loggedInUser = localStorage.getItem("loggedInUser"); // Get stored username
            if (!loggedInUser) return;

            // Fetch user's bonus from Supabase
            const { data, error } = await supabase
                .from("users") // Assuming "users" table has a "total_bonus" column
                .select("total_bonus")
                .eq("username", loggedInUser)
                .single();

            if (error) {
                console.error("Error fetching bonus:", error);
            } else if (data) {
                setTotalBonus(data.total_bonus); // Update state
            }
        };

        fetchBonus();
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
        if (confirmLogout) {
            console.log("User logged out"); // Replace with actual logout logic
            localStorage.removeItem("userSession");
            localStorage.removeItem("loggedInUser");
            window.location.href = "/login"; // Redirect to login page
        }
    };



    const filteredTransactions = transactions.filter((txn) => {
        return (
            (txn.date?.includes(search) || txn.id?.toString().includes(search) || txn.amount?.toString().includes(search) || txn.action?.includes(search)) &&
            (filter === "" || txn.action === filter)
        );
    });


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
                            <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
                                Tetapan
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

            <div className="container">
                <div className="bonuscard" onClick={() => console.log("Bonus clicked!")}>

                    <h2>
                        Total Bonus : RM {totalBonus}

                    </h2>


                </div>
                <div className="withdraw-container">


                    <input className="jumlah"
                        type="number"
                        placeholder="Nyatakan jumlah yang ingin dikeluarkan"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}

                    />
                    <button className="withdraw-button" onClick={handleWithdraw} > Pengeluaran </button>






                </div>


            </div>




            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by date, ID, amount..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="tfcard" onClick={() => console.log("withdraw clicked!")}>
                <div className="tablecontainer" >

                    <table>
                        <colgroup>
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "30%" }} />
                            <col style={{ width: "35%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Tarikh</th>
                                <th>Id Transaksi</th>
                                <th>Status</th>
                                <th>Jumlah Pengeluaran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((txn, index) => (
                                    <tr key={index}>
                                        <td>{new Date(txn.created_at).toLocaleDateString("en-GB")}</td>
                                        <td>{txn.id}</td>
                                        <td>{txn.action}</td>
                                        <td>{txn.amount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                </div>
            </div>
        </div>
    );
}

export default Bonus;

