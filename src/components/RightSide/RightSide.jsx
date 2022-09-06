import React, { useState } from "react";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";

import "./RightSide.css";
import TrendCard from "../TrendCard/TrendCard";
import ShareModal from "../ShareModal/ShareModal";
import { useNavigate } from "react-router-dom";

const RightSide = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="RightSide">
      <div className="navIcons">
        <img src={Home} alt="" onClick={() => navigate("../home")} />
        <UilSetting />
        <img src={Notification} alt="" />
        <img src={Messages} alt="" onClick={() => navigate("../chat")} />
      </div>

      <TrendCard />
      <button
        className="button sh-button"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Share
      </button>
      <ShareModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default RightSide;
