import React, { useState } from "react";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";

import "./RightSide.css";
import TrendCard from "../TrendCard/TrendCard";
import ShareModal from "../ShareModal/ShareModal";
import { useNavigate } from "react-router-dom";
import NavIcons from "../NavIcons/NavIcons";

const RightSide = ({ setReSetPosts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="RightSide">
      <NavIcons />

      <TrendCard />
      <button
        className="button sh-button"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Share
      </button>
      <ShareModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setReSetPosts={setReSetPosts}
      />
    </div>
  );
};

export default RightSide;
