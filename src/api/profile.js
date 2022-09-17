import apiClient from "./apiClient";

const endpointUpdateProfile = "api/Authorization/UpdateUser";
const endpointGetProfile = "api/Authorization/GetUserProfile/";
const endpointGetTofollow = "api/Follower/GetfollowerSuggest";
const endpointGetFollowing = "api/Follower/GetUsersFollowing";
const endpointGetSingleUser = "api/Follower/GetSpecificUser/";
const endpointCreateFollowerToggle = "api/Follower/CreateFollower";
const endpointGetExistingChats = "api/Chats/GetChatsPerUser?page=";
const endpointSearchUsers = "api/Search/SearchUser?keyword=";

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
const tryGetExistingChats = (page = 1) =>
  apiClient.get(`${endpointGetExistingChats}${page}`);
const trySearchUsers = (searchterm, page = 1) =>
  apiClient.get(`${endpointSearchUsers}${searchterm}&page=${page}`);
// const tryLikePost = (postLikeObj) =>
//   apiClient.post(endpointLikePost, postLikeObj);
export default {
  tryUpdateProfile,
  tryGetUserProfile,
  tryGetTofollow,
  tryCreateFollowerToggle,
  tryGetFollowing,
  tryGetSpecificUser,
  tryGetExistingChats,
  trySearchUsers,
};
