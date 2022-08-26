import React, { useEffect, useState } from "react";

import PostsData from "../../Data/PostsData";
import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = ({ fetchList }) => {
  return fetchList ? (
    <div className="PostsCard">
      {fetchList?.map((data) => (
        <Posts data={data} />
      ))}
    </div>
  ) : (
    ""
  );
};

export default PostsCard;
