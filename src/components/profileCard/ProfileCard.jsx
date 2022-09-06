import React from "react";
import "./ProfileCard.css";

import { useNavigate } from "react-router-dom";

const ProfileCard = ({ userProfile, isOnProfileScreen = false }) => {
  const myProfileScreen = isOnProfileScreen;
  const navigate = useNavigate();
  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        {userProfile && <img src={userProfile.coverPicUrl} alt="" />}
        {userProfile && <img src={userProfile.profilePicUrl} alt="" />}
      </div>

      <div className="ProfileName">
        {userProfile && (
          <span onClick={() => navigate("../profile")}>
            {`${userProfile.firstName} ${userProfile.lastname}`}
          </span>
        )}
        {userProfile && (
          <span>{`${userProfile.family ? userProfile.family : ""} ${
            userProfile.family && userProfile.localChurch ? "|" : ""
          } ${userProfile.localChurch ? userProfile.localChurch : ""}`}</span>
        )}
      </div>
      {userProfile && (
        <div className="followStatus">
          <hr />
          <div>
            <div className="follow">
              <span>{userProfile.followers}</span>
              <span>Followers</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
              <span>{userProfile.following}</span>
              <span>Following</span>
            </div>
            {myProfileScreen && (
              <>
                <div className="vl"></div>
                <div className="follow">
                  <span>{userProfile.totalPosts}</span>
                  <span>Posts</span>
                </div>
              </>
            )}
          </div>
          <hr />
          <div className="AboutMe">{userProfile.aboutme}</div>

          {myProfileScreen ? (
            ""
          ) : (
            <span className="Myprofile" onClick={() => navigate("../profile")}>
              My Profile
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
