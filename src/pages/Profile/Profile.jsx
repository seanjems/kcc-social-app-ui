import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import LogoSearch from "../../components/logoSearch//LogoSearch";
import MyProfileCard from "../../components/MyProfileCard/MyProfileCard";
import FollowersCard from "../../components/FollowersCard/FollowersCard";
import ProfileCard from "../../components/profileCard/ProfileCard";
import PostsCard from "../../components/PostsCard/PostsCard";
import RightSide from "../../components/RightSide/RightSide";
import PostShare from "../../components/PostShare/PostShare";
import AuthContext from "../../auth/context";
import PostsData from "../../Data/PostsData";
import posts from "../../api/posts";
import profile from "../../api/profile";
import { showNotification, updateNotification } from "@mantine/notifications";

const Profile = ({ userProfileId }) => {
  const userContext = useContext(AuthContext);
  const [fetchList, setFetchList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userContext.existingLogin();
    getItems();
    getUserProfile();
  }, []);

  const getItems = async (userProfileId) => {
    var userId = userProfileId ? userProfileId : userContext.user.UserId;
    // console.log("userId and user context", userContext, userId);

    setIsLoading(true);
    var list = await PostsData(1, userId);

    setFetchList(list);
    setIsLoading(false);
  };

  const getUserProfile = async (userProfileId) => {
    var userId = userProfileId ? userProfileId : userContext.user.UserId;
    console.log("userId and user context", userContext, userId);

    // call api

    var user = await profile.tryGetUserProfile(userId);
    if (!user.ok) {
      setUserProfile(null);
      showNotification({
        id: "user-data",
        title: "Error",
        message: `${user.status} ${user.problem}`,
        autoClose: true,
        disallowClose: false,
        // style: { zIndex: "999999" },
      });
      return;
    }

    setUserProfile(user.data);
  };
  return (
    <div className="Profile">
      <div className="ProfileLeft">
        <LogoSearch />
        <MyProfileCard userProfile={userProfile} />
        <FollowersCard />
      </div>
      <dv className="ProfileCenter">
        <ProfileCard isOnProfileScreen={true} />
        <PostShare />
        {!isLoading ? (
          <PostsCard fetchList={fetchList} />
        ) : (
          <span> Loading ...</span>
        )}
      </dv>
      <div className="ProfileRight">
        <RightSide />
      </div>
    </div>
  );
};

export default Profile;
