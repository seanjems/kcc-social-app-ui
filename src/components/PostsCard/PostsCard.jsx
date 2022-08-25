import React, { useEffect, useState } from "react";

import PostsData from "../../Data/PostsData";
import Posts from "../Posts/Posts";
import "./PostsCard.css";
import { useContext } from "react";
import postsDataContext from "../../auth/postDataContext";

const PostsCard = () => {
  const postsContext = useContext(postsDataContext);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    getItems();

    // //listen to page scrolls
    // window.addEventListener("scroll", handleScroll, { passive: true });

    // return () => {
    //   window.removeEventListener("scroll", handleScroll);
    // };
  }, []);
  // const handleScroll = () => {
  //   const position = window.pageYOffset;
  //   setScrollPosition(position);
  // };
  const getItems = async () => {
    postsContext.setIsLoading(true);
    var list = await PostsData();

    postsContext.setFetchList(list);
    postsContext.setIsLoading(false);
    console.log(list, "4567890-ihgc");
  };

  //console.log("scroll position", scrollPosition);
  return (
    !postsContext.isLoading && (
      <div className="PostsCard">
        {postsContext.fetchList.map((data) => (
          <Posts data={data} />
        ))}
      </div>
    )
  );
};

export default PostsCard;
