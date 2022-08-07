import apiClient from "./apiClient";

const endpointPosts = "api/app/posts/find-by-id";

const getPosts = () =>
  apiClient.post(
    endpointPosts,
    { id: "092ecc74-10f8-5a5d-7ad5-3a053c491e2d" },
    { headers: { accept: "application/json" } }
  );

export default {
  getPosts,
};
