import React from "react";

import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = ({ fetchList, handleLike }) => {
  return fetchList ? (
    <div className="PostsCard">
      {fetchList?.map((data, idx) => {
        return (
          <Posts data={data} handleLike={handleLike} key={idx} idx={idx} />
        );
      })}
    </div>
  ) : (
    ""
  );
};

export default PostsCard;
