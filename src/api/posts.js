import apiClient from "./apiClient";

const endpointCreatePost = "api/Posts";
const endpointGetallPostPaged = "api/Posts";

const tryCreatePost = (formData) =>
  apiClient.post(endpointCreatePost, formData);

const tryGetAllPostPaged = (formData) =>
  apiClient.get(`${endpointCreatePost}?page=${1}`);

export default {
  tryCreatePost,
  tryGetAllPostPaged,
};
