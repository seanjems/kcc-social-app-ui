import React, { useEffect, useState } from "react";

import PostsData from "../../Data/PostsData";
import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = ({ fetchList, handleLike }) => {
  return fetchList ? (
    <div className="PostsCard">
      {fetchList?.map((data) => (
        <Posts data={data} handleLike={handleLike} />
      ))}
    </div>
  ) : (
    ""
  );
};

export default PostsCard;
