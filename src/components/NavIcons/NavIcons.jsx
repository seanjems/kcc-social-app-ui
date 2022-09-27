import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "../../img/home.png";
import Notification from "../../img/noti.png";
import Messages from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import { UilSearch } from "@iconscout/react-unicons";
import ChatContext from "../../auth/ChatContext";

const NavIcons = ({ isLauncherBar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("🚀 ~ file: NavIcons.jsx ~ line 12 ~ NavIcons ~ location", location)
  const { messageBadge } = useContext(ChatContext);
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
      <div style={{ position: "relative" }}>
        <img
          src={Messages}
          alt=""
          onClick={() =>
            navigate(`${process.env.REACT_APP_PUBLIC_URL}/profile`)
          }
        />
        {messageBadge > 0 && (
          <span
            className="badge badge-dark"
            style={{
              //position: "absolute",
              right: "-0.5rem",
              bottom: "-0.5rem",
              //backgroundColor: "red",
            }}
          >
            {messageBadge}
          </span>
        )}
      </div>
    </div>
  );
};

export default NavIcons;
