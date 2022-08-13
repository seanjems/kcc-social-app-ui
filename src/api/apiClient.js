import { create } from "apisauce";

const apiClient = create({
  baseURL: "https://localhost:7204",
});

export default apiClient;
