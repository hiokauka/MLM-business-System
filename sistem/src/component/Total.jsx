import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient"; 
import DrawerAdmin from "./DrawerAdmin";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Box, Container, Typography, Card, CardContent, 
  TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, InputAdornment 
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function Total() {
  const location = useLocation();
  const [totalUsers, setTotalUsers] = useState(0); 
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => setOpenDrawer(open);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("id", { count: "exact" });
      if (!error) setTotalUsers(count || 0);
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name,created_at,username, pin, phone, bank_account, bank_name, total_bonus, alamat, ic")
        .order("created_at", { ascending: false });
      if (!error) setUsers(data || []);
    };

    fetchTotalUsers();
    fetchUsers();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Anda pasti ingin log keluar?")) {
      localStorage.removeItem("adminSession");
      window.location.href = "/login"; 
    }
  };

  const filteredUsers = users.filter((user) => {
    const s = search.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(s)) ||
      (user.username && user.username.toLowerCase().includes(s)) ||
      (user.pin && user.pin.includes(s)) ||
      (user.phone && user.phone.includes(s)) ||
      (user.bank_account && user.bank_account.includes(s)) ||
      (user.bank_name && user.bank_name.toLowerCase().includes(s)) ||
      (user.total_bonus && user.total_bonus.toString().includes(s)) ||
      (user.alamat && user.alamat.toLowerCase().includes(s)) || 
      (user.ic && user.ic.includes(s)) 
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pb: 10 }}>
      <header className="header" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderBottom: 'none' }}>
        <img src="/assets/Logo.png" className="logo" alt="Logo" />
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

      <Container maxWidth="xl" sx={{ paddingTop: '100px' }}>
        
        {/* Stats Card */}
        <Card sx={{ 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
          mb: 6,
          p: 2
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                Jumlah Pengguna Berdaftar
              </Typography>
              <Typography variant="h2" fontWeight="800">
                {totalUsers}
              </Typography>
            </Box>
            <PeopleAltIcon sx={{ fontSize: 80, opacity: 0.8 }} />
          </CardContent>
        </Card>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Carian nama, pin, nombor telefon, IC..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
              sx: { backgroundColor: 'white', borderRadius: '12px' }
            }}
          />
        </Box>

        {/* Users Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>No IC</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Pin</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>No Telefon</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Bank</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Akaun Bank</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Total Bonus</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Tarikh Daftar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>@{user.username}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.ic || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4f46e5' }}>{user.pin}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.phone}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.bank_name || '-'}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.bank_account || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#10b981' }}>RM {user.total_bonus?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {new Date(user.created_at).toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: '#64748b' }}>
                    Tiada rekod pengguna ditemui.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </Box>
  );
}

export default Total;
