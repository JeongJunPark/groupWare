import axios from "axios";

const LoginApi = axios.create({
  // baseURL: "http://localhost:4000", // NestJS 서버 주소
  baseURL: "http://172.19.1.21:4000", // NestJS 서버 주소
  
  headers: {
    "Content-Type": "application/json",
  },
});

export default LoginApi;