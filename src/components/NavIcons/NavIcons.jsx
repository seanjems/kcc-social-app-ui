import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";

const NavIcons = () => {
  const navigate = useNavigate();

  return (
    <div className="navIcons">
      <img src={Home} alt="" onClick={() => navigate("../home")} />
      <UilSetting style={{ height: "2rem", width: "2rem" }} />
      <img src={Notification} alt="" />
      <img src={Messages} alt="" onClick={() => navigate("../chat")} />
    </div>
  );
};

export default NavIcons;
