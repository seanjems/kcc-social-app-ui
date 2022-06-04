import React from "react";

import { PostsData } from "../../Data/PostsData";
import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = () => {
  return (
    <div className="PostsCard">
      {PostsData.map((data) => (
        <Posts data={data} />
      ))}
    </div>
  );
};

export default PostsCard;
