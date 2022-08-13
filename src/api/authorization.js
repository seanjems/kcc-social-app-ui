import apiClient from "./apiClient";

const endpointLogin = "api/Authorization/Login";
const endpointCreateUser = "api/Authorization/CreateUser";

const tryLogin = (email, password, rememberMe = false) =>
  apiClient.post(endpointLogin, {
    email,
    password,
    rememberMe,
  });

const tryCreateUser = (password, emailAddress, userName, name, surName) =>
  apiClient.post(endpointCreateUser, {
    password,
    emailAddress,
    userName,
    name,
    surName,
  });

export default {
  tryLogin,
  tryCreateUser,
};
