import axios from "axios";

const axiosInstance = axios.create({
  baseURL: " https://uat.search-assist.webc.in/api/",
  headers: {
    "Client-id": "7645129791",
    "Secret-key": "Qfj1UUkFItWfVFwWpJ65g0VfhjdVGN",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
export default axiosInstance;
