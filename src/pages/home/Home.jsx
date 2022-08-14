import React, { useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import "./Home.css";
import postsDataContext from "../../auth/postDataContext";

export const Home = () => {
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <postsDataContext.Provider
      value={{ fetchList, setFetchList, isLoading, setIsLoading }}
    >
      <div className="Home">
        <ProfileSide />
        <PostSide />
        <RightSide />
      </div>
    </postsDataContext.Provider>
  );
};
