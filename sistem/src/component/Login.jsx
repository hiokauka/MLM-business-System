import React, { useState } from "react";
import "../style/AdminLogin.css";  
import { Link, useNavigate } from 'react-router-dom';
import supabase from "../config/supabaseClient"; // Import Supabase

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
  
        await updateAllLevelsBonus(); // Update bonuses for the normal user
  
        window.alert("✅ Log masuk berjaya!");
        navigate("/home"); // Redirect to user home page
      }

    } catch (error) {
      window.alert("❌ Ralat berlaku, sila cuba lagi.");
      console.error("Login Error:", error);
    }
  };

  const levelBonuses = [0, 30, 5, 5, 3, 2, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5];

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
    <div className="login-container">
      <div className="form-container">
        <h2>Sila isi butiran akaun anda</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username"
            placeholder="Nama Pengguna / Username" 
            value={formData.username} 
            onChange={handleChange} 
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required
          />
          <button type="submit">Log Masuk</button>
        </form>
        <p>
          <Link to="/SignUp" className="daftarmasuk">Tiada akaun? Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
