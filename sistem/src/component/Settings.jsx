import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";
import supabase from "../config/supabaseClient";
import { 
  Box, Container, Typography, Card, CardContent, 
  TextField, Button, Grid, Avatar
} from "@mui/material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SaveIcon from '@mui/icons-material/Save';

function Settings() {
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDrawer = (open) => setOpenDrawer(open);

  const handleLogout = () => {
    if (window.confirm("Anda pasti ingin log keluar?")) {
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
    }
  };

  const [userData, setUserData] = useState({
    username: "",
    name: "",
    icNumber: "",
    pinNumber: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    oldPhone: "", 
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (!loggedInUser) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("username, name, ic, pin, phone, bank_name, bank_account")
        .eq("username", loggedInUser)
        .single();

      if (!error && data) {
        setUserData({
          username: data.username,
          name: data.name,
          icNumber: data.ic || "",  
          pinNumber: data.pin || "",
          phone: data.phone || "",
          oldPhone: data.phone || "", 
          bankName: data.bank_name || "",
          bankAccount: data.bank_account || "",
        });
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (userData.phone !== userData.oldPhone) {
        const { error: pinUpdateError } = await supabase
          .from("pins")
          .update({ phone: userData.phone }) 
          .eq("phone", userData.oldPhone); 
        if (pinUpdateError) throw pinUpdateError; 
      }

      const { error } = await supabase
        .from("users")
        .update({
          phone: userData.phone,
          bank_name: userData.bankName,
          bank_account: userData.bankAccount,
          ic: userData.icNumber,
        })
        .eq("username", userData.username);

      if (error) throw error; 

      setUserData(prev => ({ ...prev, oldPhone: userData.phone }));
      alert("Maklumat berjaya dikemaskini!"); 
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Gagal kemaskini maklumat! Sila cuba lagi."); 
    }
    setLoading(false);
  };

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

      <Container maxWidth="md" sx={{ paddingTop: '100px' }}>
        <Card sx={{ 
          borderRadius: '20px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            p: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            color: 'white'
          }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#38bdf8' }}>
              <ManageAccountsIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="800">Profil & Tetapan</Typography>
              <Typography variant="subtitle1" sx={{ color: '#94a3b8' }}>
                Kemaskini maklumat peribadi dan akaun bank anda
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Username" name="username" value={userData.username} InputProps={{ readOnly: true }} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nama Penuh" name="name" value={userData.name} InputProps={{ readOnly: true }} disabled />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nombor IC" name="icNumber" value={userData.icNumber} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Pin Keahlian" name="pinNumber" value={userData.pinNumber} InputProps={{ readOnly: true }} disabled />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Nombor Telefon" name="phone" value={userData.phone} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nama Bank" name="bankName" value={userData.bankName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nombor Akaun Bank" name="bankAccount" value={userData.bankAccount} onChange={handleChange} />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ 
                    backgroundColor: '#2563eb', 
                    px: 4, py: 1.5,
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#1d4ed8' }
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Settings;
