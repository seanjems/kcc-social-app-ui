import apiClient from "./apiClient";

const endpointCreateArticle = "api/Articles";
const endpointGetUserArticles = "api/Articles/GetArticlesForUser";

const tryCreateArticle = (formData) =>
  apiClient.post(endpointCreateArticle, formData);
const tryGetAllPerUser = (pageNumber, pageSize) =>
  apiClient.get(
    endpointGetUserArticles + `?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
export default {
  tryCreateArticle,
  tryGetAllPerUser,
};
