import apiClient from "./apiClient";

const endpointCreatePost = "api/Posts";
const endpointGetallPostPaged = "api/Posts";
const endpointLikePost = "api/Likes";

const tryCreatePost = (formData) =>
  apiClient.post(endpointCreatePost, formData);

const tryGetAllPostPaged = (page, userProfileId) =>
  apiClient.get(
    `${endpointCreatePost}?page=${page}&userProfileId=${userProfileId}`
  );
const tryLikePost = (postLikeObj) =>
  apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryCreatePost,
  tryGetAllPostPaged,
  tryLikePost,
};
