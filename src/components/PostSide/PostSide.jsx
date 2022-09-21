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
  userProfile,
  setPageNumber,
  pageNumber,
  hasMore,
  setReSetPosts,
}) => {
  return (
    <div className="PostSide">
      <PostShare
        fetchList={fetchList}
        setFetchList={setFetchList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        userProfile={userProfile}
        setReSetPosts={setReSetPosts}
      />
      <PostsCard
        fetchList={fetchList}
        handleLike={handleLike}
        selectedPostDetail={selectedPostDetail}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </div>
  );
};

export default PostSide;
