import React, { useEffect, useState } from "react";

import PostsData from "../../Data/PostsData";
import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = () => {
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
    !isLoading && (
      <div className="PostsCard">
        {fetchList.map((data) => (
          <Posts data={data} />
        ))}
      </div>
    )
  );
};

export default PostsCard;
