import React from "react";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";

import "./RightSide.css";
import TrendCard from "../TrendCard/TrendCard";

const RightSide = () => {
  return (
    <div className="RightSide">
      <div className="navIcons">
        <img src={Home} alt="" />
        <UilSetting />
        <img src={Notification} alt="" />
        <img src={Messages} alt="" />
      </div>

      <TrendCard />
      <button className="button sh-button">Share</button>
    </div>
  );
};

export default RightSide;
