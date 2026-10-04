import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { Box, Button, TextField, Typography, Container, Paper, Link } from '@mui/material';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Sila isi semua maklumat!");
      return;
    }

    // 🔹 Step 1: Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("id, role, password") // Fetch hashed password
      .eq("username", username)
      .single();

    if (error || !user) {
      alert("Nama pengguna atau kata laluan salah!");
      return;
    }

    // 🔹 Step 2: Compare passwords manually
    if (user.password !== password) {
      alert("Nama pengguna atau kata laluan salah!");
      return;
    }

    // 🔹 Step 3: Check if user is admin
    if (user.role !== "admin") {
      alert("Anda bukan admin!");
      return;
    }

    // 🔹 Step 4: Store session & redirect
    localStorage.setItem("adminSession", JSON.stringify(user));
    navigate("/total");
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)', // Distinct admin color (Deep Indigo)
      padding: 2
    }}>
      <Container maxWidth="xs">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4, textAlign: 'center', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Box mb={3}>
            <img src="/assets/Logo.png" alt="Logo" style={{ maxWidth: '120px', marginBottom: '10px' }} onError={(e) => e.target.style.display = 'none'} />
            <Typography variant="h5" fontWeight="800" color="primary.dark">
              Portal Admin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Log masuk khusus untuk pentadbir sistem
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nama Pengguna"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Kata Laluan"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              onClick={handleLogin}
              variant="contained" 
              size="large" 
              fullWidth
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none', background: 'linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)' }}
            >
              Log Masuk Admin
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 3 }}>
            Bukan Admin?{' '}
            <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold" color="primary.main">
              Kembali ke Log Masuk Pengguna
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminLogin;
