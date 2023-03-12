import apiClient from "./apiClient";

const endpointLogin = "api/Authorization/Login";
const endpointCreateUser = "api/Authorization/CreateUser";
const endpointResetPass = "api/Authorization/InitiatePasswordReset";
const endpointResetUserPassword = "api/Authorization/ResetPassword";

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
const tryResetPass = (emailAddress) =>
  apiClient.get(`${endpointResetPass}?emailAddress=${emailAddress}`);
const tryResetUserPassword = (password, emailAddress, resetToken) => {
  console.log("🚀 ~ file: authorization.js:23 ~ resetToken", resetToken);
  apiClient.post(endpointResetUserPassword, {
    password,
    emailAddress,
    resetToken,
  });
};
export default {
  tryLogin,
  tryCreateUser,
  tryResetUserPassword,
  tryResetPass,
};
