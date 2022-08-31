import apiClient from "./apiClient";

const endpointUpdateProfile = "api/Authorization/UpdateUser";
const endpointGetProfile = "api/Authorization/GetUserProfile/";

const tryUpdateProfile = (formData) =>
  apiClient.put(endpointUpdateProfile, formData);

const tryGetUserProfile = (userId) =>
  apiClient.get(`${endpointGetProfile}${userId}`);
// const tryLikePost = (postLikeObj) =>
//   apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryUpdateProfile,
  tryGetUserProfile,
};
