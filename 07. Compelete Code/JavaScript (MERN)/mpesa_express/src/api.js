import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/payment",
});

export default api;
