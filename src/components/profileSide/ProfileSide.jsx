import React from "react";
import FollowersCard from "../FollowersCard/FollowersCard";
import LogoSearch from "../logoSearch/LogoSearch";
import ProfileCard from "../profileCard/ProfileCard";

import "./ProfileSide.css";

const ProfileSide = ({ userProfile }) => {
  return (
    <div className="ProfileSide">
      <LogoSearch />
      <ProfileCard userProfile={userProfile} />
      <FollowersCard />
    </div>
  );
};

export default ProfileSide;
