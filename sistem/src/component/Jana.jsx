import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import DrawerAdmin from "./DrawerAdmin";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Box, Container, Typography, Card, CardContent, 
  Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, InputAdornment, Grid
} from "@mui/material";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Jana() {
  const location = useLocation();
  const [randomNumber, setRandomNumber] = useState("-----");
  const [nomborpin, setNomborPin] = useState([]);
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => setOpenDrawer(open);

  const handleLogout = () => {
    if (window.confirm("Anda pasti ingin log keluar?")) {
      localStorage.removeItem("adminSession");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    const { data, error } = await supabase
      .from("pins")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNomborPin(data);
    }
  };

  const totalPinsToday = nomborpin.filter(pin => {
    const pinDate = new Date(pin.created_at);
    const today = new Date();
    return pinDate.toDateString() === today.toDateString();
  }).length;

  const generateRandomNumber = async () => {
    const newPin = Math.floor(10000 + Math.random() * 90000); 
    setRandomNumber(newPin.toString());

    const today = new Date().toISOString(); 

    const { error } = await supabase.from("pins").insert([
      { pin: newPin, phone: null, status: "Aktif", created_at: today },
    ]);

    if (error) {
      alert("Gagal menyimpan PIN!");
    } else {
      fetchPins(); 
    }
  };

  const filteredpin = nomborpin.filter(
    (pin) =>
      (pin.pin && pin.pin.toString().includes(search)) ||
      (pin.phone && pin.phone.includes(search))
  );

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

      <Container maxWidth="lg" sx={{ paddingTop: '100px' }}>
        
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Generate Pin Card */}
          <Grid item xs={12} md={7}>
            <Card sx={{ 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <CardContent sx={{ p: 5, textAlign: 'center' }}>
                <VpnKeyIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
                <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: '8px', mb: 4 }}>
                  {randomNumber}
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={generateRandomNumber}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ 
                    backgroundColor: 'white', 
                    color: '#0369a1',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    px: 4, py: 1.5,
                    borderRadius: '50px',
                    '&:hover': { backgroundColor: '#f1f5f9' }
                  }}
                >
                  Hasilkan Nombor PIN Baru
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats Card */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', height: '100%' }}>
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                <Typography variant="h6" color="#64748b" gutterBottom>
                  Jumlah Pin Dijana Hari Ini
                </Typography>
                <Typography variant="h1" fontWeight="800" color="#0f172a">
                  {totalPinsToday}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Carian nombor pin atau nombor telefon..."
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

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '700', color: '#334155', fontSize: '1.05rem' }}>Nombor Pin</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155', fontSize: '1.05rem' }}>Nombor Telefon (Pendaftar)</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155', fontSize: '1.05rem' }}>Tarikh Dicipta</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155', fontSize: '1.05rem' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredpin.length > 0 ? (
                filteredpin.map((pin, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: '800', color: '#0ea5e9', fontSize: '1.1rem', letterSpacing: '2px' }}>
                      {pin.pin}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{pin.phone || '-'}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{new Date(pin.created_at).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell>
                      <Chip 
                        label={pin.status === 'Aktif' || !pin.status ? 'Aktif (Belum Diguna)' : 'Digunakan'} 
                        color={pin.status === 'Aktif' || !pin.status ? 'error' : 'default'} 
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                    Tiada rekod pin ditemui.
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

export default Jana;
