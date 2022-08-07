import React, { useContext, useEffect } from "react";
import "./Profile.css";
import LogoSearch from "../../components/logoSearch//LogoSearch";
import MyProfileCard from "../../components/MyProfileCard/MyProfileCard";
import FollowersCard from "../../components/FollowersCard/FollowersCard";
import ProfileCard from "../../components/profileCard/ProfileCard";
import PostsCard from "../../components/PostsCard/PostsCard";
import RightSide from "../../components/RightSide/RightSide";
import PostShare from "../../components/PostShare/PostShare";
import AuthContext from "../../auth/context";

const Profile = () => {
  const userContext = useContext(AuthContext);

  useEffect(() => {
    userContext.existingLogin();
  }, []);

  return (
    <div className="Profile">
      <div className="ProfileLeft">
        <LogoSearch />
        <MyProfileCard />
        <FollowersCard />
      </div>
      <dv className="ProfileCenter">
        <ProfileCard isOnProfileScreen={true} />
        <PostShare />
        <PostsCard />
      </dv>
      <div className="ProfileRight">
        <RightSide />
      </div>
    </div>
  );
};

export default Profile;
