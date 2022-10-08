import { IconSend } from "@tabler/icons";
import React, { useRef } from "react";
import PostsCard from "../PostsCard/PostsCard";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";

const PostSide = ({
  fetchList,
  setFetchList,
  isLoading,
  setIsLoading,
  handleLike,
  selectedPostDetail,
  userProfile,
  setPageNumber,
  pageNumber,
  hasMore,
  setReSetPosts,
}) => {
  const sharePostInputRef = useRef(null);

  return (
    <div className="PostSide">
      <PostShare
        fetchList={fetchList}
        setFetchList={setFetchList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        userProfile={userProfile}
        setReSetPosts={setReSetPosts}
        ref={sharePostInputRef}
      />
      <PostsCard
        fetchList={fetchList}
        handleLike={handleLike}
        selectedPostDetail={selectedPostDetail}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
        isLoading={isLoading}
        hasMore={hasMore}
      />
      {/* Floating start chat button */}
      <div
        className="floatingChatbtn showOnMobileOnly"
        onClick={() => {
          // // scroll.current?.scrollIntoView({ behavior: "smooth" });
          // sharePostInputRef.current?.scrollIntoView({
          //   behavior: "smooth",
          // });
          sharePostInputRef?.current?.focusOnShareInput();
        }}
      >
        <IconSend size={30} />
      </div>
    </div>
  );
};

export default PostSide;
