import apiClient from "./apiClient";

const endpointStartGoogleAuth = "api/Authorization/ExternalLoginCallback";
const endpointLikePost = "api/Likes";

const tryGetExternalAuthInit = (code) =>
  apiClient.get(`${endpointStartGoogleAuth}?code=${code}`);

export default {
  tryGetExternalAuthInit,
};
