import React from "react";
import PostDetail from "../PostDetail/PostDetail";

import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = ({ fetchList, handleLike, selectedPostDetail }) => {
  return fetchList ? (
    <div className="PostsCard">
      {selectedPostDetail ? (
        <PostDetail dataObj={selectedPostDetail} handleLike={handleLike} />
      ) : (
        fetchList?.map((data, idx) => {
          return (
            <Posts data={data} handleLike={handleLike} key={idx} idx={idx} />
          );
        })
      )}
    </div>
  ) : (
    ""
  );
};

export default PostsCard;
