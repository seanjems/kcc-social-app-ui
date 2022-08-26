import React from "react";
import PostsCard from "../PostsCard/PostsCard";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";
const PostSide = ({ fetchList, setFetchList, isLoading, setIsLoading }) => {
  return (
    <div className="PostSide">
      <PostShare
        fetchList={fetchList}
        setFetchList={setFetchList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <PostsCard fetchList={fetchList} />
    </div>
  );
};

export default PostSide;
