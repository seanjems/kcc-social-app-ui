import React, { useEffect, useState } from "react";

import PostsData from "../../Data/PostsData";
import Posts from "../Posts/Posts";
import "./PostsCard.css";
import { useContext } from "react";
import postsDataContext from "../../auth/postDataContext";

const PostsCard = () => {
  const postsContext = useContext(postsDataContext);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    postsContext.setIsLoading(true);
    var list = await PostsData();

    postsContext.setFetchList(list);
    postsContext.setIsLoading(false);
    console.log(list, "4567890-ihgc");
  };
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
