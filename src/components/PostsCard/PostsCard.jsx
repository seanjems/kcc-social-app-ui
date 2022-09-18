import React from "react";
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
}) => {
  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  return fetchList ? (
    <div className="PostsCard">
      {selectedPostDetail ? (
        <PostDetail dataObj={selectedPostDetail} handleLike={handleLike} />
      ) : (
        fetchList?.map((data, idx) => {
          if (fetchList.length === idx + 1) {
            return (
              <div ref={lastPostElementRef} key={idx}>
                <Posts data={data} handleLike={handleLike} idx={idx} />
              </div>
            );
          } else {
            return (
              <div key={idx}>
                <Posts data={data} handleLike={handleLike} idx={idx} />
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
