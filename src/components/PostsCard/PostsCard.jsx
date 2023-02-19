import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import PostDetail from "../PostDetail/PostDetail";

import Posts from "../Posts/Posts";
import "./PostsCard.css";

const PostsCard = ({
  fetchList,
  isLoading,
  setPageNumber,
  pageNumber,
  handleLike,
  selectedPostDetail,
  hasMore,
}) => {
  const observer = useRef();
  const componentRef = useRef();
  const [parentScrolled, setParentScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const newValue = Math.random().toString();

      setParentScrolled(newValue);
    };

    const componentElement = componentRef.current;
    componentElement.addEventListener("scroll", handleScroll);

    return () => {
      componentElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const lastPostElementRef = useCallback(
    (node) => {
      // console.log("🚀 ~ file: PostsCard.jsx ~ line 21 ~ node", node);
      // console.log("🚀 ~ file: PostsCard.jsx ~ line 23 ~ isLoading", isLoading);
      // console.log("🚀 ~ file: PostsCard.jsx ~ line 23 ~ hasMore", hasMore);
      if (isLoading || !hasMore) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // console.log(
        //   "🚀 ~ file: PostsCard.jsx ~ line 24 ~ observer.current=newIntersectionObserver ~ entries",
        //   entries
        // );
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  return fetchList ? (
    <div className="PostsCard" ref={componentRef}>
      {selectedPostDetail ? (
        <PostDetail dataObj={selectedPostDetail} handleLike={handleLike} />
      ) : (
        fetchList?.map((data, idx) => {
          if (fetchList.length === idx + 1) {
            // console.log(
            //   "🚀 ~ file: PostsCard.jsx ~ line 40 ~ fetchList?.map ~ fetchList.length",
            //   fetchList.length
            // );
            return (
              <div ref={lastPostElementRef} key={idx}>
                <Posts
                  data={data}
                  handleLike={handleLike}
                  idx={idx}
                  parentScrolled={parentScrolled}
                />
              </div>
            );
          } else {
            return (
              <div key={idx}>
                <Posts
                  data={data}
                  handleLike={handleLike}
                  idx={idx}
                  parentScrolled={parentScrolled}
                />
              </div>
            );
          }
        })
      )}
    </div>
  ) : (
    ""
  );
};

export default React.memo(PostsCard);
