import React from "react";
import "../style/landingpage.css";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

function LandingPage() {

  const navigate = useNavigate();


  const handleAdminClick = () => {
    console.log("Admin button clicked");
    navigate("/loginadmin");
  };

  const handleUserClick = () => {
    console.log("User button clicked");
    navigate("/login");
  };

  return (
    <div className="Main" >
      <div> 

      
        
        <h1>Jana Income B40 </h1>


        <p>Pilih peranan anda</p>
        </div>

      <div className="button-container">
        <button className="btn admin-btn" onClick={handleAdminClick}>
          Admin
        </button>
        <button className="btn user-btn" onClick={handleUserClick}>
          Pengguna
        </button>
      </div>
    </div>
  );
}

export default LandingPage; // ✅ Ensure this is present
