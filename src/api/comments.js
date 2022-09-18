import apiClient from "./apiClient";

const endpointGetAllComments = "api/Comments/GetCommentsPerPost";
const endpointPostComment = "api/Comments/PostComments";
const endpointEditComment = "api/Comments/PutComments";
const endpointDeleteComent = "api/Comments/DeleteComments/";

const tryGetCommentsPerPost = (postId, page = 1) =>
  apiClient.get(`${endpointGetAllComments}?PostId=${postId}&page=${page}`);
const tryDeleteComments = (id) =>
  apiClient.delete(`${endpointDeleteComent}${id}`);

const tryPostComment = (postId) => apiClient.post(endpointPostComment, postId);
const tryPutComment = (newData) => apiClient.put(endpointEditComment, newData);
export default {
  tryGetCommentsPerPost,
  tryPostComment,
  tryDeleteComments,
  tryPutComment,
};
