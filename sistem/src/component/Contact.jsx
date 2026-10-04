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
  Avatar
} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import "../style/Contact.css";

function Contact() {
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (open) => setOpenDrawer(open);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Anda pasti ingin log keluar?");
    if (confirmLogout) {
      localStorage.removeItem("userSession");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login"; 
    }
  };

  const contactMethods = [
    {
      title: "Admin Khidmat Pelanggan",
      detail: "011-2429 7004",
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      color: "#38bdf8"
    },
    {
      title: "Emel Rasmi",
      detail: "Pusatpembangunanusahawan@gmail.com",
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      color: "#818cf8"
    },
    {
      title: "Ibu Pejabat",
      detail: "Menara Prestige, Exit, Jalan Pinang, 50450 Kuala Lumpur",
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      color: "#f472b6"
    },
    {
      title: "Talian Pejabat",
      detail: "010-214 7671",
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      color: "#34d399"
    }
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
          mb: 8,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)'
        }}>
          <Container maxWidth="md">
            <Typography variant="h3" fontWeight="800" gutterBottom sx={{ color: 'white' }}>
              Hubungi Kami
            </Typography>
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 2 }}>
              Kami sedia membantu anda. Sila hubungi kami melalui mana-mana saluran di bawah.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {contactMethods.map((method, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: '20px', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 50px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: method.color + '20', // Add transparency
                      color: method.color,
                      width: 80, 
                      height: 80 
                    }}>
                      {method.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="700" color="#1e293b" gutterBottom>
                        {method.title}
                      </Typography>
                      <Typography variant="body1" color="#475569" sx={{ wordBreak: 'break-word' }}>
                        {method.detail}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Contact;