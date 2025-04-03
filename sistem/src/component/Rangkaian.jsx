import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import "../style/rangkaian.css";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";


function Rangkaian() {
  const location = useLocation();
  const [userNetwork, setUserNetwork] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [sponsoredCount, setSponsoredCount] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => {
    setOpenDrawer(open);  // This will open or close the drawer
  };


  const levelRequirements = [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8];

  const levelBonuses = [0, 30, 5, 5, 3, 2, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
    }
  };

  const updateBonus = async (user, level, downlineCount) => {
    const currentBonusCount = user.bonus_count || {};

    const previousCount = currentBonusCount[`level_${level}`] || 0;

    if (downlineCount > previousCount) {
      const bonusAmount = (downlineCount - previousCount) * levelBonuses[level];

      await supabase
        .from("users")
        .update({
          total_bonus: (parseFloat(user.total_bonus) || 0) + bonusAmount,
          bonus_count: {
            ...currentBonusCount,
            [`level_${level}`]: downlineCount
          }
        })
        .eq("username", localStorage.getItem("loggedInUser"));
    }
  };

  const fetchDownline = async (level) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) return;

    let currentLevelPins = [];

    const startTime = Date.now();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("pin, name, total_bonus, bonus_count")
      .eq("username", loggedInUser)
      .single();

    if (userError || !user) {
      console.error("Error fetching user pin:", userError);
      return;
    }

    currentLevelPins = [user.pin];

    const { data: sponsoredUsers, error: sponsorError } = await supabase
      .from("users")
      .select("username")
      .eq("referral_pin", user.pin);

    if (!sponsorError && sponsoredUsers) {
      setSponsoredCount(sponsoredUsers.length);
    }

    if (sponsoredCount < levelRequirements[level]) {
      setUserNetwork([]);
      setTotalBonus(0);
      return;
    }

    let downline = [];

    for (let i = 0; i < level; i++) {
      const { data, error } = await supabase
        .from("users")
        .select("name, phone, created_at, pin")
        .in("referral_pin", currentLevelPins);

      if (error || !data || data.length === 0) {
        // If no data is found for the level, reset the downline and exit
        setUserNetwork([]);
        setTotalBonus(0);
        return;
      }


      downline = data;

      if (i === level - 1) {
        updateBonus(user, level, downline.length);

        setUserNetwork(downline.map(user => ({ ...user, bonus: levelBonuses[level] })));
      }


      currentLevelPins = downline.map((user) => user.pin);
    }

    const endTime = Date.now(); // End time for query
    const duration = endTime - startTime; // Duration of the query
    console.log(`Query took: ${duration} milliseconds`);
  };

  useEffect(() => {
    fetchDownline(selectedLevel);
  }, [selectedLevel, sponsoredCount]);

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
        <label htmlFor="level">Pilih Level Downline:</label>
        <select id="level" value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))}>
          {[...Array(15).keys()].map((level) => (
            <option key={level + 1} value={level + 1}>Level {level + 1}</option>
          ))}
        </select>
      </div>

      <div className="tablecard">
        <div className="tablecontainer">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Date Joined</th>
                <th>Bonus (RM)</th>
              </tr>
            </thead>
            <tbody>
              {userNetwork.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No downline found
                  </td>
                </tr>
              ) : (
                userNetwork.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>{user.bonus}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Rangkaian;
