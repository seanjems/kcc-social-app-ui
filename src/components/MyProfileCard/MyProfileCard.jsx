import React, { useContext, useState } from "react";
import "./MyProfileCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import AuthContext from "../../auth/context";

const MyProfileCard = ({ userProfile }) => {
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
          {userProfile && <span>{userProfile.relationship}</span>}
        </div>
        <div>
          <span>
            <b>Lives in: </b>
          </span>
          {userProfile && <span>{userProfile.address}</span>}
        </div>

        <div>
          <span>
            <b>Family/Clan: </b>
          </span>
          {userProfile && <span>{userProfile.family}</span>}
        </div>
        <div>
          <span>
            <b>Profession: </b>
          </span>
          {userProfile && <span>{userProfile.profession}</span>}
        </div>
        <button
          className="button lg-button"
          onClick={() => {
            userContext.setUser(null);
            localStorage.removeItem("token");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyProfileCard;
