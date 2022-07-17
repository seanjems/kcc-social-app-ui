import React from "react";
import Logo from "../../img/logo.png";
import { UilSearch } from "@iconscout/react-unicons";
import "./LogoSearch.css";
import { useNavigate } from "react-router-dom";
const LogoSearch = () => {
  const navigate = useNavigate();
  return (
    <div className="LogoSearch">
      <div className="logoIcon" onClick={() => navigate("../home")}>
        <img src={Logo} alt="sda-logo" />
      </div>
      <div className="Search">
        <input type="text" placeholder="#Search..." />
        <div className="s-icon">
          <UilSearch />
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;
