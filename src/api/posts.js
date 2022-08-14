import apiClient from "./apiClient";

const endpGetallPaged = "api/Posts";

const tryCreatePost = (formData) => apiClient.post(endpGetallPaged, formData);

export default {
  tryCreatePost,
};
