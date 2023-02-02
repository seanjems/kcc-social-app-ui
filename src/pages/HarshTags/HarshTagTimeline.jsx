import React, { useContext, useEffect, useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import PostsData from "../../Data/PostsData";
import "./HarshTagTimeline.css";
import AuthContext from "../../auth/context";
import posts from "../../api/posts";
import profile from "../../api/profile";
import { showNotification } from "@mantine/notifications";
import { useLocation, useParams } from "react-router-dom";
import { useRef } from "react";
import { IconSend } from "@tabler/icons";


export const HarshTagTimeline = ({harshTag}) => {
  console.log("🚀 ~ file: HarshTagTimeline.jsx:17 ~ HarshTagTimeline ~ harshTag in the componet orig", harshTag)
  const userContext = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [selectedPostDetail, setSelectedPostDetail] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [reSetPosts, setReSetPosts] = useState(null);

 

  let { tag } = useParams();
  console.log("🚀 ~ file: HarshTagTimeline.jsx:30 ~ HarshTagTimeline ~ tag", tag)
  
  // let { postId } = useParams();
  let { pathname } = useLocation();
  console.log("🚀 ~ file: HarshTagTimeline.jsx:31 ~ HarshTagTimeline ~ pathname", pathname)
  harshTag=tag;
  const isMobileSearch = pathname === "/search";
  //console.log("🚀 ~ file: Home.jsx ~ line 21 ~ Home ~ postId", postId);
  useEffect(() => {
    // setSelectedPostDetail(null);
    // if (postId) {
    //   getSingleItem(postId);
    // }
    
    getItems(1);
    getUserProfile();
  }, [useParams().tag]);

  //hard rest posts on create post
  useEffect(() => {
    (reSetPosts == true || reSetPosts == false) && getItems(1);
  }, [reSetPosts]);

  //infinite scroling
  useEffect(() => {
    if (pageNumber > 1 && !isLoading && hasMore) {
      return getItems();
    }
  }, [pageNumber]);

  // console.log("🚀 ~ file: Home.jsx ~ line 41 ~ Home ~ pageNumber", pageNumber);

  const getItems = async (postPageNumber = null) => {
    setIsLoading(true);
    setHasMore(true);
    // call api
    postPageNumber = postPageNumber ?? pageNumber;
    if (harshTag[0] === "#" && harshTag.length>1) {
      harshTag = harshTag.substr(1);
  }
    var result = await posts.tryGetAllPostPerTagPaged(harshTag, postPageNumber);
    if (!result.ok) {
      setUserProfile(null);
      showNotification({
        id: "user-data",
        title: "Error",
        message: `${result.status && result.status} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        // style: { zIndex: "999999" },
      });
      if (result.status === 401) {
        //logout user
        console.log(result.status);
        userContext.setUser(null);
        localStorage.removeItem("token");
      }
      return;
    }
    if (!result.data.length) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    //if it was a hard refresh
    if (postPageNumber === 1) {
      setFetchList(result.data);
      setIsLoading(false);
      setPageNumber(1);
      return;
    }
    //create deep copy backup
    const originalValues = JSON.parse(JSON.stringify(fetchList));
    const copy2 = [...originalValues, ...result.data];

    setFetchList(copy2);
    setIsLoading(false);
  };
  const getSingleItem = async (postId) => {
    setIsLoading(true);

    // call api

    var result = await posts.tryGetSinglePost(postId);
    if (!result.ok) {
      setUserProfile(null);
      showNotification({
        id: "user-data",
        title: "Error",
        message: `${result.status && result.status} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        // style: { zIndex: "999999" },
      });
      return;
    }

    setSelectedPostDetail(result.data);
    setIsLoading(false);
  };
  const getUserProfile = async (userProfileId) => {
    var userId = userProfileId ? userProfileId : userContext.user.UserId;
    console.log("🚀 ~ file: HarshTagTimeline.jsx:130 ~ getUserProfile ~ userProfileId", userProfileId)
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
      if (user.status === 401) {
        //logout user
        userContext.setUser(null);
        localStorage.removeItem("token");
      }
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
      {fetchList.length || !isLoading ? (
        <PostSide
          fetchList={fetchList}
          handleLike={handleLike}
          setFetchList={setFetchList}
          selectedPostDetail={selectedPostDetail}
          userProfile={userProfile}
          setPageNumber={setPageNumber}
          pageNumber={pageNumber}
          isLoading={isLoading}
          hasMore={hasMore}
          setReSetPosts={setReSetPosts}
        />
      ) : (
        <span> Loading...</span>
      )}
      <RightSide userProfile={userProfile} setReSetPosts={setReSetPosts} />
    </div>
  );
};
