import apiClient from "./apiClient";

const endpointCreatePost = "api/Posts";
const endpointGetallPostPaged = "api/Posts";
const endpointLikePost = "api/Likes";
const endpointSearchPosts = "api/Posts/GetpostsByKeywords";

const tryCreatePost = (formData) =>
  apiClient.post(endpointCreatePost, formData);

const tryGetAllPostPaged = (page, userProfileId, userName = null) =>
  apiClient.get(
    `${endpointCreatePost}?page=${page}&userProfileId=${userProfileId}&userName=${userName}`
  );
const tryGetTrendingTags = (page) =>
  apiClient.get(`${endpointCreatePost}/GetTrendingTags?page=${page}`);
const tryGetAllPostPerTagPaged = (keyWords, page = 1) => {
  return apiClient.get(
    `${endpointSearchPosts}?keyWords=${keyWords}&page=${page}`
  );
};

const tryGetSinglePost = (postId) =>
  apiClient.get(`${endpointGetallPostPaged}/${postId}`);
const tryLikePost = (postLikeObj) =>
  apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryCreatePost,
  tryGetAllPostPaged,
  tryGetAllPostPerTagPaged,
  tryLikePost,
  tryGetSinglePost,
  tryGetTrendingTags,
};
