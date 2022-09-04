import React, { useContext, useEffect, useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import PostsData from "../../Data/PostsData";
import "./Home.css";
import AuthContext from "../../auth/context";
import posts from "../../api/posts";
import profile from "../../api/profile";
import { showNotification } from "@mantine/notifications";

export const Home = () => {
  const userContext = useContext(AuthContext);
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    getItems();
    getUserProfile();
  }, []);

  const getItems = async () => {
    setIsLoading(true);
    var list = await PostsData();

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
  const handleLike = async (idx) => {
    var fetchListCopy = [...fetchList];
    // console.log(
    //   "initiating likes with fetchlistcopy and idx",
    //   fetchListCopy,
    //   idx,
    //   fetchListCopy[idx]
    // );

    //create deep copy backup
    const originalValues = JSON.parse(JSON.stringify(fetchList));
    const currentState = fetchListCopy[idx]?.liked;
    fetchListCopy[idx].liked = !currentState;
    fetchListCopy[idx].likes = currentState
      ? fetchListCopy[idx]?.likes - 1
      : fetchListCopy[idx]?.likes + 1;
    setFetchList(fetchListCopy);
    // call api
    const userId = userContext.user.UserId;
    var like = await posts.tryLikePost({
      postId: fetchListCopy[idx]?.id,
      userId: userId,
    });
    if (!like.ok) {
      setFetchList(originalValues);
      return;
    }
    fetchListCopy[idx].liked = !currentState;
    fetchListCopy[idx].likes = like.data.likes;
    setFetchList(fetchListCopy);
  };

  return (
    <div className="Home">
      <ProfileSide userProfile={userProfile} />
      {!isLoading ? (
        <PostSide fetchList={fetchList} handleLike={handleLike} />
      ) : (
        <span> Loading...</span>
      )}
      <RightSide userProfile={userProfile} />
    </div>
  );
};
