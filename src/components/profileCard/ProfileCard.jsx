import React from "react";
import CoverPic from "../../img/cover.jpg";
import ProfilePic from "../../img/profileImg.jpg";
import "./ProfileCard.css";

const ProfileCard = () => {
  const myProfileScreen = true;
  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img src={CoverPic} alt="" />
        <img src={ProfilePic} alt="" />
      </div>

      <div className="ProfileName">
        <span>Ruth Kokusiima</span>
        <span>Deaconess/Singer/Youth choir</span>
      </div>
      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>512</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>17</span>
            <span>Following</span>
          </div>
          {myProfileScreen && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>25</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
        <div className="AboutMe">
          A hopeful believer, a singer and a proud member of Reuben Family. My
          Jesus reigns!!
        </div>

        {myProfileScreen ? "" : <span className="Myprofile">My Profile</span>}
      </div>
    </div>
  );
};

export default ProfileCard;
