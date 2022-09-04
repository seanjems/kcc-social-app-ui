import React from "react";

import "./FollowersCard.css";
const FollowersCard = ({ toFollowList, handleFollow }) => {
  return (
    <div className="FollowersCard">
      <h3>Who is following you</h3>
      {toFollowList && (
        <>
          {toFollowList.slice(0, 6).map((follower, id) => {
            return (
              <div className="follower" key={id}>
                <div>
                  <img src={follower.profilePicUrl} alt="" />
                  <div className="followername">
                    <span className="FollowerName">{`${
                      follower.firstName ? follower.firstName : ""
                    } ${follower.lastname ? follower.lastname : ""}`}</span>
                    {follower.userName && <span>@{follower.userName}</span>}
                  </div>
                </div>
                <button
                  className="f-button button"
                  onClick={() => handleFollow(id)}
                >
                  Follow
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default FollowersCard;
