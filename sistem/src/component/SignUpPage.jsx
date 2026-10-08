import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { Box, Button, TextField, Typography, Container, Paper, Link, Grid } from '@mui/material';

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    alamat: "",
    ic: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bank_account: "",
    bank_name: "",
    pin: "",
    referral: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.includes(" ")) {
      alert("Username tidak boleh mengandungi ruang! Contoh username  : harisi1982 , rogayah21 , aisyah");
      return;
    }


    if (formData.password.includes(" ")) {
      alert("Kata laluan tidak boleh mengandungi ruang (space)!");
      return;
    }

    // 🛑 Validate passwords
    if (formData.password !== formData.confirmPassword) {
      alert("Kata laluan tidak sepadan!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Kata laluan mesti 6 aksara ke atas!");
      return;
    }

    try {
      // ✅ Check PIN
      const { data: pinData, error: pinError } = await supabase
        .from("pins")
        .select("pin, status")
        .eq("pin", formData.pin)
        .single();

      if (!pinData || (pinData.status !== "Aktif" && pinData.status !== null && pinData.status !== "available")) {
        alert("PIN tidak sah atau telah digunakan!");
        return;
      }

      // ✅ Check phone number
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("phone", formData.phone)
        .single();

      if (existingUser) {
        alert("Nombor telefon sudah berdaftar!");
        return;
      }

      // ✅ Check referral pin (optional)
      const referralPin = formData.referral.trim();
      if (referralPin) {
        const { data: referrer, error: refError } = await supabase
          .from("users")
          .select("id")
          .eq("pin", referralPin)
          .single();

        if (refError || !referrer) {
          alert("PIN Referral tidak sah! Pastikan PIN Referral adalah dari pengguna yang sudah mendaftar (upline), atau biarkan kosong jika tiada.");
          return;
        }
      }

      // ✅ Insert user data
      const { error: userError } = await supabase.from("users").insert([
        {
          username: formData.username,
          name: formData.name,
          alamat: formData.alamat,
          ic: formData.ic,
          phone: formData.phone,
          password: formData.password,
          bank_account: formData.bank_account,
          bank_name: formData.bank_name,
          pin: formData.pin,
          referral_pin: referralPin || null,
          role: "user",
          total_bonus: 0,
          bonus_count: {},
        },
      ]);

      if (userError) throw userError;

      // ✅ Update PIN status to 'used' and set user's phone number
      await supabase
        .from("pins")
        .update({ status: "used", phone: formData.phone })
        .eq("pin", formData.pin);

      alert("Pendaftaran berjaya!");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Ralat berlaku semasa mendaftar.");
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Sleek dark slate gradient
      padding: 3
    }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Box textAlign="center" mb={3}>
            <img src="/assets/Logo.png" alt="Logo" style={{ maxWidth: '120px', marginBottom: '10px' }} onError={(e) => e.target.style.display = 'none'} />
            <Typography variant="h5" fontWeight="800" color="primary.dark">
              Pendaftaran Akaun Baru
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Lengkapkan maklumat di bawah untuk menyertai kami
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Username" name="username" fullWidth value={formData.username} onChange={handleChange} required variant="outlined" helperText="Tiada jarak (space), guna nama mudah. Contoh: aisyah" FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 'bold' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nama Penuh" name="name" fullWidth value={formData.name} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Alamat Rumah" name="alamat" fullWidth value={formData.alamat} onChange={handleChange} required variant="outlined" multiline rows={2} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="No. IC" name="ic" fullWidth value={formData.ic} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nombor Telefon" name="phone" type="tel" fullWidth value={formData.phone} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Kata Laluan" name="password" type="password" fullWidth value={formData.password} onChange={handleChange} required variant="outlined" helperText="Tiada jarak (space). Contoh: aisyah123" FormHelperTextProps={{ sx: { color: 'error.main', fontWeight: 'bold' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Pengesahan Kata Laluan" name="confirmPassword" type="password" fullWidth value={formData.confirmPassword} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nama Bank" name="bank_name" fullWidth value={formData.bank_name} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nombor Akaun Bank" name="bank_account" fullWidth value={formData.bank_account} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="PIN Pengaktifan" name="pin" fullWidth value={formData.pin} onChange={handleChange} required variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="PIN Referral (Pilihan)" name="referral" fullWidth value={formData.referral} onChange={handleChange} variant="outlined" />
              </Grid>
            </Grid>
            
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              sx={{ mt: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none', background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)' }}
            >
              Daftar Sekarang
            </Button>
          </Box>
          
          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Sudah ada akaun?{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold" color="primary.main">
                Log Masuk
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignUpPage;
