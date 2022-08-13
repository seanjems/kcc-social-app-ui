import apiClient from "./apiClient";

const endpGetallPaged = "api/Authorization/CustomLogin";

const tryLogin = (userNameOrEmailAddress, password, rememberMe = false) =>
  apiClient.post(endpointLogin, {
    userNameOrEmailAddress,
    password,
    rememberMe,
  });

export default {
  tryLogin,
};
