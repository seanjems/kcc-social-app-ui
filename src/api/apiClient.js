import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://localhost:44361",
});

export default apiClient;
