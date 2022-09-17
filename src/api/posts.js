import apiClient from "./apiClient";

const endpointCreatePost = "api/Posts";
const endpointGetallPostPaged = "api/Posts";
const endpointLikePost = "api/Likes";

const tryCreatePost = (formData) =>
  apiClient.post(endpointCreatePost, formData);

const tryGetAllPostPaged = (page, userProfileId, userName = null) =>
  apiClient.get(
    `${endpointCreatePost}?page=${page}&userProfileId=${userProfileId}&userName=${userName}`
  );
const tryGetSinglePost = (postId) =>
  apiClient.get(`${endpointGetallPostPaged}/${postId}`);
const tryLikePost = (postLikeObj) =>
  apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryCreatePost,
  tryGetAllPostPaged,
  tryLikePost,
  tryGetSinglePost,
};
