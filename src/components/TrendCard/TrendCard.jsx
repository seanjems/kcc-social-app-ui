import { showNotification } from "@mantine/notifications";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import posts from "../../api/posts";
import AuthContext from "../../auth/context";
import { TrendData } from "../../Data/TrendData";
import TextWithTags from "../Reusables/TextWithHarshTags/TextWithTags";

import "./TrendCard.css";

const TrendCard = () => {

  
  const[fetchList, setFetchList] = useState();
  const [page, setPage]=useState(1);
  const[isLoading, setIsLoading] = useState();
  const[hasMore, setHasMore] = useState();

  const navigate = useNavigate();

  const userContext = useContext(AuthContext);
  useEffect(() => {
    getItems(page);  
    
  }, [])
  const searchByTag = (tag) => {
   tag= tag.replace(/#/gi, "");
    navigate(`../trending/${tag}`);
    // console.log(`Searching by tag: ${tag}`);
  };

  const getItems = async (postPageNumber = null) => {
    setIsLoading(true);
    setHasMore(true);
    // call api
    postPageNumber = postPageNumber ?? page;
    
    var result = await posts.tryGetTrendingTags(postPageNumber);
    if (!result.ok) {
     
      showNotification({
        id: "user-data",
        title: "Error",
        message: `${result.status && result.status} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        // style: { zIndex: "999999" },
      });
      if (result.status === 401) {
        //logout user
        console.log(result.status);
        userContext.setUser(null);
        localStorage.removeItem("token");
      }
      return;
    }
    if (!result.data.length) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
    //if it was a hard refresh
    if (postPageNumber === 1) {
      setFetchList(result.data);
      setIsLoading(false);
      setPage(1);
      return;
    }
    //create deep copy backup
    const originalValues = JSON.parse(JSON.stringify(fetchList));
    const copy2 = [...originalValues, ...result.data];
  
    setFetchList(copy2);
    setIsLoading(false);
  };
  return (
    <div className="TrendCard">
      <h3>Trending topics</h3>
      {fetchList&&fetchList?.map((trend, idx) => (
        <div key={idx}>
          <span style={{cursor:"pointer"}} onClick={()=>searchByTag(trend.harshTagName)}>{trend.harshTagName}</span>
          <span>{trend.frequencyCount&& trend.frequencyCount>1000?(trend.frequencyCount/1000).toLocaleString("en-US")+"k":trend.frequencyCount} shares</span>
        </div>
      ))}
    </div>
  );
};

export default TrendCard;
