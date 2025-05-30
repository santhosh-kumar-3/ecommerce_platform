import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.31.77:5000/api",
  timeout: 5000,
});

export default api;
