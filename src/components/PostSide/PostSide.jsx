import React from "react";
import PostsCard from "../PostsCard/PostsCard";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";
const PostSide = ({
  fetchList,
  setFetchList,
  isLoading,
  setIsLoading,
  handleLike,
  selectedPostDetail,
}) => {
  return (
    <div className="PostSide">
      <PostShare
        fetchList={fetchList}
        setFetchList={setFetchList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <PostsCard
        fetchList={fetchList}
        handleLike={handleLike}
        selectedPostDetail={selectedPostDetail}
      />
    </div>
  );
};

export default PostSide;
