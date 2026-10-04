import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import supabase from "../config/supabaseClient";
import DrawerAdmin from "./DrawerAdmin";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Box, Container, Typography, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Chip, InputAdornment, Grid, Card, CardContent
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

function Inquiry() {
  const location = useLocation();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => setOpenDrawer(open);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data: pending } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("action", "pending")
      .order("created_at", { ascending: false }); 

    const { data: completed } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("action", "completed")
      .order("created_at", { ascending: false }); 

    setPendingRequests(pending || []);
    setCompletedRequests(completed || []);
  };

  const markAsComplete = async (id) => {
    if (window.confirm("Sahkan pembayaran ini telah selesai?")) {
      const { error } = await supabase
        .from("withdrawals")
        .update({ action: "completed" }) 
        .eq("id", id);
      if (!error) fetchRequests();
    }
  };

  const handleLogout = () => {
    if (window.confirm("Anda pasti ingin log keluar?")) {
      localStorage.removeItem("adminSession");
      window.location.href = "/login";
    }
  };

  const filteredRequests = completedRequests.filter((req) =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase())
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

      <Container maxWidth="xl" sx={{ paddingTop: '100px' }}>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Pending Stats Card */}
          <Grid item xs={12} md={6}>
             <Card sx={{ borderRadius: '20px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Permintaan Tertunggak (Pending)</Typography>
                  <Typography variant="h2" fontWeight="800">{pendingRequests.length}</Typography>
                </Box>
                <AccessTimeFilledIcon sx={{ fontSize: 80, opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Stats Card */}
          <Grid item xs={12} md={6}>
             <Card sx={{ borderRadius: '20px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>Permintaan Selesai (Completed)</Typography>
                  <Typography variant="h2" fontWeight="800">{completedRequests.length}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 80, opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Table */}
        <Typography variant="h5" fontWeight="800" color="#0f172a" gutterBottom sx={{ mb: 2 }}>
          Senarai Permintaan Semasa (Tertunggak)
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 8, border: '1px solid #fef3c7' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#fffbeb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '700', color: '#b45309' }}>Tarikh</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#b45309' }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#b45309' }}>Bank</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#b45309' }}>Nombor Akaun</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#b45309' }}>Jumlah (RM)</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#b45309' }} align="center">Tindakan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell sx={{ color: '#64748b' }}>{new Date(req.created_at).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#0f172a' }}>{req.name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{req.bank_name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{req.account_number}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#ea580c' }}>RM {req.amount.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Button 
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => markAsComplete(req.id)}
                        sx={{ borderRadius: '8px', fontWeight: 'bold', textTransform: 'none' }}
                      >
                        Sahkan Selesai
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                    Tiada permintaan semasa.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Completed Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight="800" color="#0f172a">
            Sejarah Permintaan Selesai
          </Typography>
          <TextField
            placeholder="Cari berdasarkan nama..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
              sx: { backgroundColor: 'white', borderRadius: '10px', minWidth: '300px' }
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Tarikh Selesai</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Bank</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Nombor Akaun</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Jumlah (RM)</TableCell>
                <TableCell sx={{ fontWeight: '700', color: '#334155' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell sx={{ color: '#64748b' }}>{new Date(req.created_at).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#0f172a' }}>{req.name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{req.bank_name}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{req.account_number}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>RM {req.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label="Selesai" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b' }}>
                    Tiada rekod penyelesaian ditemui.
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

export default Inquiry;
