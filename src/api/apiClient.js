import { create } from "apisauce";
import { useContext } from "react";

const apiClient = create({
  baseURL: "https://localhost:7204",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default apiClient;
