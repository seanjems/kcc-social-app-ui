import { create } from "apisauce";
import { useContext } from "react";

const apiClient = create({
  baseURL: process.env.REACT_APP_PUBLIC_API_URL,
  //baseURL: "https://localhost:5001",
  //baseURL: "https://api.kampalacentraladventist.org",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default apiClient;
