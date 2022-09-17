import { showNotification } from "@mantine/notifications";
import React, { useContext, useEffect, useState } from "react";
import profile from "../../api/profile";
import AuthContext from "../../auth/context";
import FollowersCard from "../../components/FollowersCard/FollowersCard";
import LogoSearch from "../../components/logoSearch//LogoSearch";
import MyProfileCard from "../../components/MyProfileCard/MyProfileCard";
import PostsCard from "../../components/PostsCard/PostsCard";
import PostShare from "../../components/PostShare/PostShare";
import ProfileCard from "../../components/profileCard/ProfileCard";
import RightSide from "../../components/RightSide/RightSide";
import PostsData from "../../Data/PostsData";
import "./Profile.css";
import { IconX } from "@tabler/icons";
import { useParams } from "react-router-dom";
import posts from "../../api/posts";

const Profile = ({ userProfileId }) => {
  const userContext = useContext(AuthContext);
  const [fetchList, setFetchList] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refetchProfile, setRefetchProfile] = useState(false);
  const [toFollowList, setToFollowList] = useState(null);
  const [updateToFollow, setUpdateToFollow] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  let { userName } = useParams();

  useEffect(() => {
    // userContext.existingLogin();
    getItems(userName);
    getUserProfile();
  }, [refetchProfile, postsPage]);

  useEffect(() => {
    getToFollow();
  }, [updateToFollow]);

  const profileUpdated = () => {
    setRefetchProfile(!refetchProfile);
  };
  const getItems = async (userProfileName) => {
    var userId = userProfileName ? null : userContext.user.UserId;
    var userProfileName = userProfileName;
    // console.log("userId and user context", userContext, userId);

    setIsLoading(true);
    const result = await posts.tryGetAllPostPaged(
      postsPage,
      userId,
      userProfileName
    );
    if (!result.ok) {
      showNotification({
        id: "save-data",
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
    }

    //console.log("fetch posts result", result.data);

    // var list = await PostsData(postsPage, userId, userProfileName);

    setFetchList(result.data);
    setIsLoading(false);
  };

  const handleFollow = async (idx) => {
    var toFollowListBackup = JSON.parse(JSON.stringify(toFollowList));
    var toFollowListCopy = [...toFollowList];
    toFollowListCopy.splice(idx, 1);
    console.log(
      "after splicing the array",
      toFollowListCopy,
      toFollowListBackup
    );
    setToFollowList(toFollowListCopy);

    //update backend server

    var result = await profile.tryCreateFollowerToggle({
      toFollowId: toFollowListBackup[idx]?.userId,
    });

    if (!result.ok) {
      showNotification({
        id: "save-data",
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      setToFollowList(toFollowListBackup);
      return;
    }

    //refetch follow suggestions if all followed
    if (toFollowListBackup.length === 1) {
      setUpdateToFollow(!updateToFollow);
    }
  };
  const getToFollow = async () => {
    //var userId = userProfileId ? userProfileId : userContext.user.UserId;
    // console.log("userId and user context", userContext, userId);

    var result = await profile.tryGetTofollow();
    if (!result.ok) {
      showNotification({
        id: "save-data",
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      return;
    }

    setToFollowList(result.data);
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
        <MyProfileCard
          userProfile={userProfile}
          profileUpdated={profileUpdated}
        />
        <FollowersCard
          toFollowList={toFollowList}
          handleFollow={handleFollow}
        />
      </div>
      <div className="ProfileCenter">
        <ProfileCard isOnProfileScreen={true} userProfile={userProfile} />
        <PostShare />
        {!isLoading ? (
          <PostsCard fetchList={fetchList} />
        ) : (
          <span> Loading ...</span>
        )}
      </div>
      <div className="ProfileRight">
        <RightSide />
      </div>
    </div>
  );
};

export default Profile;
