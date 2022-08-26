import apiClient from "./apiClient";

const endpointCreatePost = "api/Posts";
const endpointGetallPostPaged = "api/Posts";

const tryCreatePost = (formData) =>
  apiClient.post(endpointCreatePost, formData);

const tryGetAllPostPaged = (page, userProfileId) =>
  apiClient.get(
    `${endpointCreatePost}?page=${page}&userProfileId=${userProfileId}`
  );

export default {
  tryCreatePost,
  tryGetAllPostPaged,
};
