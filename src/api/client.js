import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://localhost:44361",
  timeout: 30000,
  headers: { Accept: "application/json" },
});

export default apiClient;
