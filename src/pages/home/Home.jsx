import React, { useEffect, useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import PostsData from "../../Data/PostsData";
import "./Home.css";

export const Home = () => {
  const [fetchList, setFetchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    setIsLoading(true);
    var list = await PostsData();

    setFetchList(list);
    setIsLoading(false);
    console.log(list, "4567890-ihgc");
  };
  return (
    <div className="Home">
      <ProfileSide />
      {!isLoading ? <PostSide fetchList={fetchList} /> : "Loading..."}
      <RightSide />
    </div>
  );
};
