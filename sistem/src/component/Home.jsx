import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerComponent from "./DrawerComponent";
import MenuIcon from "@mui/icons-material/Menu";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider,
  Paper
} from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import "../style/Home.css"; 

function Home() {
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
    }
  };

  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

  const benefits = [
    { text: "Pendapatan sehingga 15 Level", icon: <AutoGraphIcon color="primary" /> },
    { text: "Berpeluang menerima Pakej Pelancongan Percuma", icon: <FlightTakeoffIcon color="primary" /> },
    { text: "Terima Promaster Alkali (PMA) PERCUMA bernilai RM890", icon: <CardGiftcardIcon color="primary" /> },
    { text: "Bonus boleh dikeluarkan secara Harian atau Mingguan", icon: <AccountBalanceWalletIcon color="primary" /> },
    { text: "Tiada bayaran penyelenggaraan (Maintenance)", icon: <CheckCircleOutlineIcon color="primary" /> },
    { text: "Pendapatan boleh diwariskan kepada waris yang juga merupakan ahli", icon: <HealthAndSafetyIcon color="primary" /> },
  ];

  const rewards = [
    { level: "LEVEL 1", reward: "RM 200.00 + PROMASTER ALKALI PERCUMA" },
    { level: "LEVEL 2", reward: "RM 500.00" },
    { level: "LEVEL 3", reward: "(PAKEJ UMRAH) RM 2,000.00" },
    { level: "LEVEL 4", reward: "(PAKEJ NEW ZEALAND) RM 20,000.00" },
    { level: "LEVEL 5", reward: "(TAJ MAHAL) RM 20,000.00" },
    { level: "LEVEL 6", reward: "RM 2,000,000.00" },
    { level: "LEVEL 7 - 8", reward: "RM 5,000,000.00" },
  ];

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

      <Box sx={{ paddingTop: '100px' }}>
        
        {/* HERO SECTION */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
          color: 'white', 
          py: 8, 
          px: 2,
          textAlign: 'center',
          mb: 6,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)'
        }}>
          <Container maxWidth="lg">
            <Typography variant="h3" fontWeight="800" gutterBottom sx={{ 
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              KESIHATAN • PELANCONGAN • PENDAPATAN
            </Typography>
            <Typography variant="h5" fontWeight="600" sx={{ mb: 4, color: '#94a3b8' }}>
              KOMUNITI MENJANA PENDAPATAN
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '800px', mx: 'auto', mb: 5, lineHeight: 1.6, color: '#e2e8f0' }}>
              Ingin menikmati percutian <strong>PERCUMA</strong> ke destinasi impian termasuk <strong>UMRAH</strong> sambil menjana pendapatan?
            </Typography>
            
            <Paper elevation={24} sx={{ 
              p: 4, 
              display: 'inline-block', 
              borderRadius: '20px', 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Typography variant="h6" color="white" gutterBottom>
                Sertai program keahlian kami dengan pembelian sekali seumur hidup
              </Typography>
              <Typography variant="h3" fontWeight="900" color="#38bdf8" sx={{ my: 2 }}>
                RM150.00 SAHAJA
              </Typography>
              <Typography variant="body1" color="#cbd5e1">
                + PERCUMA 4 Botol Vitamin Saraf (Bernilai RM200)
              </Typography>
            </Paper>
          </Container>
        </Box>

        <Container maxWidth="lg">
          
          {/* KEISTIMEWAAN SECTION */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight="800" textAlign="center" gutterBottom sx={{ color: '#0f172a', mb: 4 }}>
              Keistimewaan Menjadi Ahli
            </Typography>
            <Grid container spacing={3}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    height: '100%', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                  }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 3 }}>
                      <Box sx={{ mr: 2, mt: 0.5 }}>
                        {benefit.icon}
                      </Box>
                      <Typography variant="body1" fontWeight="600" color="#334155">
                        {benefit.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* PRODUK SECTION */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight="800" textAlign="center" gutterBottom sx={{ color: '#0f172a', mb: 4 }}>
              Kelebihan Produk
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', borderRadius: '20px', background: 'linear-gradient(145deg, #ffffff, #f1f5f9)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="800" color="#2563eb" gutterBottom>
                      1. Promaster Alkali (PMA)
                    </Typography>
                    <Typography variant="body1" paragraph color="#475569">
                      PMA mengandungi alkali 9.5 pH yang sangat sesuai untuk membuang toksik dalam tubuh anda.
                    </Typography>
                    <Box component="ul" sx={{ color: '#475569', pl: 2, mb: 3 }}>
                      <li>Mengandungi bahan mineral yang tinggi serta membekalkan tenaga untuk badan.</li>
                      <li>Membantu membuang toksik dan kekalkan keseimbangan badan.</li>
                      <li>Disarankan minum 1.5L sehari secara konsisten.</li>
                    </Box>
                    <Typography variant="subtitle2" fontWeight="700" color="#0f172a">
                      Boleh merawat dan mencegah penyakit 5 serangkai (Kencing Manis, Darah Tinggi, Kolesterol, Buah Pinggang, Gout) dan kanser.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', borderRadius: '20px', background: 'linear-gradient(145deg, #ffffff, #f1f5f9)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="800" color="#2563eb" gutterBottom>
                      2. Vitamin Saraf (4 Botol)
                    </Typography>
                    <Typography variant="body1" paragraph color="#475569">
                      Mereka yang membuat pembelian RM150.00 akan dapat 4 botol Vitamin Saraf yang bernilai RM200.00.
                    </Typography>
                    <Box component="ul" sx={{ color: '#475569', pl: 2, mb: 3 }}>
                      <li>Gabungan herba terpilih termasuk ginseng yang sangat sesuai untuk merawat penyakit saraf.</li>
                      <li>Membantu bagi mereka yang mengalami kebas di kaki atau di tangan terutamanya pada waktu maghrib hingga malam.</li>
                      <li>Tidak mengandungi bahan kimia berbahaya, organik semula jadi yang tidak merosakkan buah pinggang.</li>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* GANJARAN TAMBAHAN SECTION */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight="800" textAlign="center" gutterBottom sx={{ color: '#0f172a', mb: 2 }}>
              Ganjaran Tambahan & Pakej Percutian
            </Typography>
            <Typography variant="body1" textAlign="center" color="#64748b" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
              Setiap orang perlu mempromosikan kepada 10 ahli baru tanpa had masa bagi melayakkan untuk mendapat pakej pelancongan percuma dan Promaster Alkali secara percuma.
            </Typography>
            
            <Card sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {rewards.map((row, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      display: 'flex', 
                      p: 3, 
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderBottom: idx !== rewards.length - 1 ? '1px solid #e2e8f0' : 'none',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="h6" fontWeight="700" color="#0f172a" sx={{ width: '150px' }}>
                      {row.level}
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="#2563eb">
                      {row.reward}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>

          {/* CALL TO ACTION */}
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h4" fontWeight="800" color="#0f172a" gutterBottom>
              Jom Sertai Sekarang!
            </Typography>
            <Typography variant="h6" color="#475569" sx={{ mb: 4 }}>
              Pendaftaran Sekali Seumur Hidup
            </Typography>
            
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<WhatsAppIcon />}
              href="https://wa.me/60102147671"
              target="_blank"
              sx={{ 
                backgroundColor: '#25D366', 
                color: 'white',
                px: 5,
                py: 2,
                borderRadius: '30px',
                fontSize: '1.2rem',
                fontWeight: '700',
                textTransform: 'none',
                boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
                '&:hover': {
                  backgroundColor: '#1EBE5D',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(37, 211, 102, 0.5)',
                }
              }}
            >
              Whatsapp Kami: 010-214 7671
            </Button>
            
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="#94a3b8" fontWeight="600">Langkah 1: Whatsapp Admin</Typography>
              <Typography variant="body2" color="#94a3b8" fontWeight="600">Langkah 2: Snap Resit</Typography>
              <Typography variant="body2" color="#94a3b8" fontWeight="600">Langkah 3: Terima Akaun</Typography>
            </Box>
          </Box>

        </Container>
      </Box>
    </Box>
  );
}

export default Home;