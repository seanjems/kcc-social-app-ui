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
import { useNavigate, useParams } from "react-router-dom";
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
  const [hasMore, setHasMore] = useState(true);
  const [reSetPosts, setReSetPosts] = useState(null);

  let { userName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // userContext.existingLogin();
    getItems(userName);
    getUserProfile(userName);
  }, [refetchProfile]);

  //reset posts on post creation
  useEffect(() => {
    // userContext.existingLogin();
    getItems(userName, 1);
  }, [reSetPosts]);

  useEffect(() => {
    getToFollow();
  }, [updateToFollow]);

  const profileUpdated = () => {
    setRefetchProfile(!refetchProfile);
  };

  //infinite scroling
  useEffect(() => {
    if (postsPage > 1 && !isLoading && hasMore) {
      return getItems(userName);
    }
  }, [postsPage]);

  const getItems = async (userProfileName, postPageNumber = null) => {
    var userId = userProfileName ? null : userContext.user.UserId;
    var userProfileName = userProfileName;
    // console.log("userId and user context", userContext, userId);
    postPageNumber = postPageNumber ?? postsPage;

    setIsLoading(true);
    setHasMore(true);
    const result = await posts.tryGetAllPostPaged(
      postPageNumber,
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

    if (!result.data.length) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    //if it was a hard refresh
    if (postPageNumber === 1) {
      setFetchList([]);
    }
    //create deep copy backup
    const originalValues = JSON.parse(JSON.stringify(fetchList));
    const copy2 = [...originalValues, ...result.data];

    setFetchList(copy2);
    setIsLoading(false);

    // setFetchList(result.data);
    // setIsLoading(false);
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

  const getUserProfile = async (userProfileName) => {
    var userId = userProfileName ? null : userContext.user.UserId;
    var userProfileName = userProfileName;

    // var userId = userProfileId ? userProfileId : userContext.user.UserId;
    // console.log("userId and user context", userContext, userId);

    // call api

    var user = await profile.tryGetUserProfile(userId, userProfileName);
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
        <LogoSearch
          setSelectedItemCallBack={(data) => navigate(`/${data?.userName}`)}
        />
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
        <PostShare userProfile={userProfile} setReSetPosts={setReSetPosts} />
        {!isLoading || fetchList.length ? (
          <PostsCard
            fetchList={fetchList}
            handleLike={handleLike}
            setPageNumber={setPostsPage}
            pageNumber={postsPage}
            isLoading={isLoading}
            hasMore={hasMore}
          />
        ) : (
          <span> Loading ...</span>
        )}
      </div>
      <div className="ProfileRight">
        <RightSide setReSetPosts={setReSetPosts} />
      </div>
    </div>
  );
};

export default Profile;
