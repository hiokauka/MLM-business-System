import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Box, Container, Typography, Card, CardContent, 
  Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

function Rangkaian() {
  const location = useLocation();
  const [userNetwork, setUserNetwork] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [sponsoredCount, setSponsoredCount] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => setOpenDrawer(open);

  const levelRequirements = [0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8];
  const levelBonuses = [0, 20, 5, 2, 2, 2, 2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

  const handleLogout = () => {
    if (window.confirm("Anda pasti ingin log keluar?")) {
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
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("pin, name, total_bonus, bonus_count")
      .eq("username", loggedInUser)
      .single();

    if (userError || !user) return;
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
        .select("name, username, phone, created_at, pin")
        .in("referral_pin", currentLevelPins);

      if (error || !data || data.length === 0) {
        setUserNetwork([]);
        setTotalBonus(0);
        return;
      }
      downline = data;
      if (i === level - 1) {
        updateBonus(user, level, downline.length);
        setUserNetwork(downline.map(u => ({ ...u, bonus: levelBonuses[level] })));
      }
      currentLevelPins = downline.map((u) => u.pin);
    }
  };

  useEffect(() => {
    fetchDownline(selectedLevel);
  }, [selectedLevel, sponsoredCount]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pb: 10 }}>
      {/* Header / Navbar */}
      <header className="header" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderBottom: 'none' }}>
        <img src="/assets/Logo.png" className="logo" alt="Logo" />
        <MenuIcon
          className="hamburger"
          onClick={() => toggleDrawer(true)}
          style={{ fontSize: 30, cursor: 'pointer', display: 'none' }}
        />
        <nav className="navbar">
          <ul>
            <li><Link to="/home" className={location.pathname === "/home" ? "active" : ""}>Utama</Link></li>
            <li><Link to="/bonus" className={location.pathname === "/bonus" ? "active" : ""}>Bonus</Link></li>
            <li><Link to="/rangkaian" className={location.pathname === "/rangkaian" ? "active" : ""}>Rangkaian anda</Link></li>
            <li><Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>Tetapan</Link></li>
            <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Hubungi kami</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <LogoutIcon />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <DrawerComponent openDrawer={openDrawer} toggleDrawer={toggleDrawer} handleLogout={handleLogout} />

      <Container maxWidth="lg" sx={{ paddingTop: '100px' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <AccountTreeIcon sx={{ fontSize: 40, color: '#2563eb' }} />
          <Typography variant="h4" fontWeight="800" color="#0f172a">
            Rangkaian Anda
          </Typography>
        </Box>

        <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', mb: 6, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Typography variant="h6" color="#334155" fontWeight="600">
                Pilih Level Downline:
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Level"
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  sx={{ borderRadius: '10px' }}
                >
                  {[...Array(15).keys()].map((level) => (
                    <MenuItem key={level + 1} value={level + 1}>
                      Level {level + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ ml: 'auto' }}>
                <Typography variant="body2" color="#64748b">Tajaan Terus (Level 1):</Typography>
                <Typography variant="h6" fontWeight="700" color="#0f172a">{sponsoredCount} Ahli</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Downline Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Nombor Telefon</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Tarikh Sertai</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Bonus Dijana (RM)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userNetwork.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="h6" color="#94a3b8" gutterBottom>Tiada Rekod Downline</Typography>
                    {sponsoredCount < levelRequirements[selectedLevel] && (
                      <Typography variant="body2" color="error">
                        Syarat tajaan tidak mencukupi untuk membuka Level {selectedLevel}. Anda perlu menaja sekurang-kurangnya {levelRequirements[selectedLevel]} ahli secara terus.
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                userNetwork.map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>@{user.username}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.phone}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{new Date(user.created_at).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#10b981' }}>RM {user.bonus.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </Box>
  );
}

export default Rangkaian;
