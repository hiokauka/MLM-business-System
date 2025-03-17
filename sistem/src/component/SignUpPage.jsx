import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/SignUpPage.css";
import supabase from "../config/supabaseClient";

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
   
    password: "",
    confirmPassword: "",
    bank_account: "",
    bank_name: "",
    pin: "",
    referral: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛑 Validate passwords
    if (formData.password !== formData.confirmPassword) {
      window.alert("Kata laluan tidak sepadan!");
      return;
    }
    if (formData.password.length < 6) {
      window.alert("Kata laluan mesti mempunyai sekurang-kurangnya 6 aksara!");
      return;
    }

    try {
      // 🔍 Step 1: Check if the PIN exists and is available
      let { data: pinData, error: pinError } = await supabase
        .from("pins")
        .select("pin")
        .eq("pin", formData.pin)
        .eq("status", "available")
        .single();

      if (pinError || !pinData) {
        window.alert("PIN tidak sah atau telah digunakan!");
        return;
      }

      // 🔍 Step 2: Check if phone number already exists
      let { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("phone", formData.phone)
        .single();

      if (existingUser) {
        window.alert("Nombor telefon sudah didaftarkan!");
        return;
      }

      // 🔍 Step 3: If referral is provided, check if it exists
      if (formData.referral) {
        let { data: referrer } = await supabase
          .from("users")
          .select("id")
          .eq("pin", formData.referral)
          .single();

        if (!referrer) {
          window.alert("PIN Referral tidak sah!");
          return;
        }
      }

      // ✅ Step 4: Insert new user into 'users' table
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert([
          {
            username: formData.username,
            name: formData.name,
            phone: formData.phone,
           
            password: formData.password,
            bank_account: formData.bank_account,
            bank_name: formData.bank_name,
            pin: formData.pin, // Store the used PIN
            referral_pin: formData.referral ? formData.referral : null, // Store referral PIN if given
          },
        ])
        .select()
        .single();

      if (userError) {
        window.alert(userError.message);
        return;
      }

      // ✅ Step 5: Mark the PIN as used
      await supabase
      .from("pins")
      .update({
        status: "used",
        phone: formData.phone, // Store the user's phone number
      })
      .eq("pin", formData.pin);

      alert("Pendaftaran berjaya!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      window.alert("Ralat berlaku. Sila cuba lagi.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Daftar Akaun</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Nama:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      

        <label>Nombor Telefon:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Kata Laluan:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Pengesahan Kata Laluan:</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

        <label>Nombor Akaun Bank:</label>
        <input type="text" name="bank_account" value={formData.bank_account} onChange={handleChange} required />

        <label>Nama Bank:</label>
        <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} required />

        <label>PIN:</label>
        <input type="text" name="pin" value={formData.pin} onChange={handleChange} required />

        <label>PIN Referral :</label>
        <input type="text" name="referral" value={formData.referral} onChange={handleChange} />

        <button type="submit">Daftar</button>
      </form>
      <p>
        Sudah ada akaun? <Link to="/login" className="daftarmasuk">Log Masuk</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
