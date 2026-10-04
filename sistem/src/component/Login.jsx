import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import supabase from "../config/supabaseClient"; // Import Supabase
import { Box, Button, TextField, Typography, Container, Paper, Link } from '@mui/material';

function Login() {
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    console.log('🔍 Supabase Connection:', supabase)

    try {
      // 🔍 Step 1: Check if user exists
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", formData.username)
        .single(); // Fetch single user

      if (userError || !user) {
        window.alert("❌ Username tidak berdaftar!");
        return;
      }

      // 🔍 Step 2: Validate password
      if (user.password !== formData.password) {
        window.alert("❌ Kata laluan tidak sah!");
        return;
      }

      if (user.role === "admin") {
        // Admin login
        localStorage.setItem("adminSession", JSON.stringify(user));
        window.alert("✅ Log masuk berjaya sebagai admin!");
        navigate("/total"); // Redirect to admin page
      } else {
        // Normal user login
        localStorage.setItem("userSession", JSON.stringify(user));
        localStorage.setItem("loggedInUser", formData.username);

        await supabase
          .from("pins")
          .update({ phone: user.phone })
          .eq("pin", user.pin);


        await updateAllLevelsBonus(); // Update bonuses for the normal user

        window.alert("✅ Log masuk berjaya!");
        navigate("/home"); // Redirect to user home page
      }

    } catch (error) {
      window.alert("❌ Ralat berlaku, sila cuba lagi.");
      console.error("Login Error:", error);
    }
  };

  const levelBonuses = [0, 20, 5, 2, 2, 2, 2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

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

  const updateAllLevelsBonus = async () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) return;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("pin, name, total_bonus, bonus_count")
      .eq("username", loggedInUser)
      .single();

    if (userError || !user) {
      console.error("Error fetching user pin:", userError);
      return;
    }

    let currentLevelPins = [user.pin];

    for (let level = 1; level <= 15; level++) {
      const { data: downline, error: downlineError } = await supabase
        .from("users")
        .select("pin")
        .in("referral_pin", currentLevelPins);

      if (downlineError || !downline || downline.length === 0) break;

      await updateBonus(user, level, downline.length);

      currentLevelPins = downline.map((user) => user.pin);
    }
  };


  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Sleek dark slate gradient
      padding: 2
    }}>
      <Container maxWidth="xs">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4, textAlign: 'center', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Box mb={3}>
            <img src="/assets/Logo.png" alt="Logo" style={{ maxWidth: '120px', marginBottom: '10px' }} onError={(e) => e.target.style.display = 'none'} />
            <Typography variant="h5" fontWeight="800" color="primary.dark">
              Log Masuk Akaun
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Sila isi butiran akaun anda untuk meneruskan
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nama Pengguna"
              name="username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Kata Laluan"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none', background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Log Masuk
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 3 }}>
            Tiada akaun?{' '}
            <Link component={RouterLink} to="/SignUp" underline="hover" fontWeight="bold" color="primary.main">
              Daftar Sekarang
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
