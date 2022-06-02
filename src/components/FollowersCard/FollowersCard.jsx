import React from "react";

import { Followers } from "../../Data/FollowersData";
import "./FollowersCard.css";
const FollowersCard = () => {
  return (
    <div className="FollowersCard">
      <h3>Who is following you</h3>
      {Followers.map((follower) => (
        <div className="follower" key={follower.username}>
          <div>
            <img src={follower.img} alt="" />
            <div className="followername">
              <span className="FollowerName">{follower.name}</span>
              <span>@{follower.username}</span>
            </div>
          </div>
          <button className="f-button button">Follow</button>
        </div>
      ))}
    </div>
  );
};

export default FollowersCard;
