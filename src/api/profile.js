import apiClient from "./apiClient";

const endpointUpdateProfile = "api/Authorization/UpdateUser";
const endpointGetProfile = "api/Authorization/GetUserProfile/";
const endpointGetTofollow = "api/Follower/GetfollowerSuggest";
const endpointGetFollowing = "api/Follower/GetUsersFollowing";
const endpointGetSingleUser = "api/Follower/GetSpecificUser/";
const endpointCreateFollowerToggle = "api/Follower/CreateFollower";

const tryUpdateProfile = (formData) =>
  apiClient.put(endpointUpdateProfile, formData);

const tryGetTofollow = () => apiClient.get(endpointGetTofollow);
const tryGetFollowing = () => apiClient.get(endpointGetFollowing);
const tryGetSpecificUser = (userId) =>
  apiClient.get(`${endpointGetSingleUser}${userId}`);
const tryCreateFollowerToggle = (followObj) =>
  apiClient.post(endpointCreateFollowerToggle, followObj);

const tryGetUserProfile = (userId) =>
  apiClient.get(`${endpointGetProfile}${userId}`);
// const tryLikePost = (postLikeObj) =>
//   apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryUpdateProfile,
  tryGetUserProfile,
  tryGetTofollow,
  tryCreateFollowerToggle,
  tryGetFollowing,
  tryGetSpecificUser,
};
