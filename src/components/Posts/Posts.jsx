import React from "react";
import "./Posts.css";

import Like from "../../img/notlike.png";
import Liked from "../../img/like.png";
import Share from "../../img/share.png";
import Comment from "../../img/comment.png";

const Posts = ({ data, idx, handleLike }) => {
  return (
    <div className="Posts">
      <span>
        <b>{data.name}</b>
      </span>
      {data.desc && <span>{data.desc}</span>}
      {data.img && <img src={data.img} alt="" />}
      <div className="shareOptions">
        <img
          src={data.liked ? Liked : Like}
          alt=""
          onClick={() => handleLike(idx)}
        />
        <img src={Comment} alt="" />
        <img src={Share} alt="" />
      </div>
    </div>
  );
};

export default Posts;
