import React, { useContext, useState } from "react";
import "./MyProfileCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import AuthContext from "../../auth/context";

const MyProfileCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userContext = useContext(AuthContext);

  return (
    <div className="MyProfileCard">
      <div>
        <h4>Your Info</h4>

        <UilPen
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
        <ProfileModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
      <div className="detail">
        <div>
          <span>
            <b>Status: </b>
          </span>
          <span>In a relationship</span>
        </div>
        <div>
          <span>
            <b>Lives in: </b>
          </span>
          <span>Kampala</span>
        </div>

        <div>
          <span>
            <b>Family/Clan: </b>
          </span>
          <span>Reuben</span>
        </div>
        <div>
          <span>
            <b>Profession: </b>
          </span>
          <span>Medic</span>
        </div>
        <button
          className="button lg-button"
          onClick={() => {
            userContext.setIsLoggedIn(false);
            localStorage.removeItem("isLoggedIn");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyProfileCard;
