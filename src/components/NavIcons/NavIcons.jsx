import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import { UilSearch } from "@iconscout/react-unicons";

const NavIcons = ({ isLauncherBar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("🚀 ~ file: NavIcons.jsx ~ line 12 ~ NavIcons ~ location", location)

  return (
    <div className="navIcons">
      <img src={Home} alt="" onClick={() => navigate("../home")} />

      {isLauncherBar ? (
        <UilSearch
          onClick={() => navigate("../search")}
          style={{ height: "2rem", width: "2rem" }}
        />
      ) : (
        <UilSetting style={{ height: "2rem", width: "2rem" }} />
      )}
      <img src={Notification} alt="" />
      <img src={Messages} alt="" onClick={() => navigate("../chat")} />
    </div>
  );
};

export default NavIcons;
