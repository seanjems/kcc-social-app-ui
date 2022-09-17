import React from "react";
import { useNavigate } from "react-router-dom";
import FollowersCard from "../FollowersCard/FollowersCard";
import LogoSearch from "../logoSearch/LogoSearch";
import ProfileCard from "../profileCard/ProfileCard";

import "./ProfileSide.css";

const ProfileSide = ({ userProfile }) => {
  const navigate = useNavigate();

  return (
    <div className="ProfileSide">
      <LogoSearch
        setSelectedItemCallBack={(data) => navigate(`/${data?.userName}`)}
      />
      <ProfileCard userProfile={userProfile} />
      <FollowersCard />
    </div>
  );
};

export default ProfileSide;
