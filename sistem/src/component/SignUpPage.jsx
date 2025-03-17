import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/SignUpPage.css";
import supabase from "../config/supabaseClient";

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
        .select("pin")
        .eq("pin", formData.pin)
        .eq("status", "available")
        .single();

      if (!pinData) {
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
      if (formData.referral) {
        const { data: referrer } = await supabase
          .from("users")
          .select("id")
          .eq("pin", formData.referral)
          .single();

        if (!referrer) {
          alert("PIN Referral tidak sah!");
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
          referral_pin: formData.referral || null,
        },
      ]);

      if (userError) throw userError;

      // ✅ Update PIN status to 'used'
      await supabase.from("pins").update({ status: "used" }).eq("pin", formData.pin);

      

      // ✅ Update PIN with the user's phone number
      await supabase
        .from("pins")
        .update({ phone: formData.phone })
        .eq("pin", formData.pin);

      alert("Pendaftaran berjaya!");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Ralat berlaku semasa mendaftar.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Daftar Akaun</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Nama:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Alamat rumah :</label>
        <input type="text" name="alamat" value={formData.alamat} onChange={handleChange} required />

        <label>No IC:</label>
        <input type="text" name="ic" value={formData.ic} onChange={handleChange} required />

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

        <label>PIN Referral:</label>
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
