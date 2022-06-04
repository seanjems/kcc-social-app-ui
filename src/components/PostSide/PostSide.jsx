import React from "react";
import PostsCard from "../PostsCard/PostsCard";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";
const PostSide = () => {
  return (
    <div className="PostSide">
      <PostShare />
      <PostsCard />
    </div>
  );
};

export default PostSide;
