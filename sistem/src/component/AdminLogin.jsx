import React, { useState } from "react";
import "../style/AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

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
    <div className="login-container">
      <h2>Admin Login Page</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      <p>
        Bukan Admin?{" "}
        <Link to="/login" className="forgot-password-link">
          Log masuk
        </Link>
      </p>
    </div>
  );
}

export default AdminLogin;
