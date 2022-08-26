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

const Profile = () => {
  const userContext = useContext(AuthContext);
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    userContext.existingLogin();
    getItems();
  }, []);

  const getItems = async () => {
    var userId = userContext.user.UserId;
    console.log("userId and user context", userContext, userId);

    setIsLoading(true);
    var list = await PostsData(1, userId);

    setFetchList(list);
    setIsLoading(false);
  };
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
        {!isLoading ? <PostsCard fetchList={fetchList} /> : "Loading ..."}
      </dv>
      <div className="ProfileRight">
        <RightSide />
      </div>
    </div>
  );
};

export default Profile;
