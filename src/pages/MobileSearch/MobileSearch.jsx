import React, { Fragment, useContext, useEffect, useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import PostsData from "../../Data/PostsData";
import "./MobileSearch.css";
import AuthContext from "../../auth/context";
import posts from "../../api/posts";
import profile from "../../api/profile";
import { showNotification } from "@mantine/notifications";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import LogoSearch from "../../components/logoSearch/LogoSearch";
import TrendCard from "../../components/TrendCard/TrendCard";

export const MobileSearch = () => {
  const userContext = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [selectedPostDetail, setSelectedPostDetail] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  let { postId } = useParams();
  let {pathname} = useLocation()
const isMobileSearch = pathname==="/search";
  console.log("🚀 ~ file: Home.jsx ~ line 26 ~ Home ~ isMobileSearch", isMobileSearch)
  //console.log("🚀 ~ file: Home.jsx ~ line 21 ~ Home ~ postId", postId);
  useEffect(() => {
    setSelectedPostDetail(null);
    if (postId) {
      getSingleItem(postId);
    }
    getItems();
    getUserProfile();
  }, [useParams().postId]);

  //infinite scroling
  useEffect(() => {
    if (pageNumber > 1 && !isLoading && hasMore) {
      return getItems();
    }
  }, [pageNumber]);
  // console.log("🚀 ~ file: Home.jsx ~ line 41 ~ Home ~ pageNumber", pageNumber);

  const getItems = async () => {
    setIsLoading(true);
    setHasMore(true);
    // call api

    var result = await posts.tryGetAllPostPaged(pageNumber);
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
    if (!result.data.length) {
      setHasMore(false);
      setIsLoading(false);
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
    <div className="Home2">
      
     <LogoSearch setSelectedItemCallBack={(data) => navigate(`/${data?.userName}`)}/>
     {/* {!isMobileSearch&& <Fragment>

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
        />
      ) : (
        <span> Loading...</span>
      )}
      </Fragment>} */}

    <TrendCard />
     
    </div>
  );
};
