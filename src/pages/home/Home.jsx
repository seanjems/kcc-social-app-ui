import React, { useContext, useEffect, useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import PostsData from "../../Data/PostsData";
import "./Home.css";
import AuthContext from "../../auth/context";
import posts from "../../api/posts";

export const Home = () => {
  const userContext = useContext(AuthContext);
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    setIsLoading(true);
    var list = await PostsData();

    setFetchList(list);
    setIsLoading(false);
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
      <ProfileSide />
      {!isLoading ? (
        <PostSide fetchList={fetchList} handleLike={handleLike} />
      ) : (
        <span> Loading...</span>
      )}
      <RightSide />
    </div>
  );
};
