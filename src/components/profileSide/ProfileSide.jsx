import React from "react";
import FollowersCard from "../FollowersCard/FollowersCard";
import LogoSearch from "../logoSearch/LogoSearch";
import ProfileCard from "../profileCard/ProfileCard";

import "./ProfileSide.css";

const ProfileSide = () => {
  return (
    //inline Styling because the profile css is not being picked. find out why...
    <div
      className="ProfileSide"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        alignItems: "center",
      }}>
      <LogoSearch />
      <ProfileCard />
      <FollowersCard />
    </div>
  );
};

export default ProfileSide;
