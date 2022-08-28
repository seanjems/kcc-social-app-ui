import apiClient from "./apiClient";

const endpointUpdateProfile = "api/Authorization/UpdateUser";

const tryUpdateProfile = (formData) =>
  apiClient.put(endpointUpdateProfile, formData);

// const tryGetAllPostPaged = (page, userProfileId) =>
//   apiClient.get(
//     `${endpointCreatePost}?page=${page}&userProfileId=${userProfileId}`
//   );
// const tryLikePost = (postLikeObj) =>
//   apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryUpdateProfile,
};
