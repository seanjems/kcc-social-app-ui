import posts from "../api/posts";

const fetchPostsPaged = async (page, userProfileId, userName) => {
  // console.log("Sending post request with profileId", userProfileId);
  const result = await posts.tryGetAllPostPaged(page, userProfileId, userName);
  if (!result.ok) return [];

  //console.log("fetch posts result", result.data);
  return result.data;

  // if (!result.ok) {
  //   setCreatePostFailed(true);
  //   setCreatePostErrors(result.data);
  //   return;
  // }

  //add to posts array
};

const PostsData = (page = 1, userProfileId, userName) => {
  console.log("received userId for post", userProfileId);
  return fetchPostsPaged(page, userProfileId);
};
export default PostsData;
