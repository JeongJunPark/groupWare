import React, { useState } from "react";
import LoginApi from "../testApi/LoginAPI";
import { LoginDto } from "../login/user";
import { useNavigate } from "react-router-dom";
import Logo from "../static/images/login_img.png"
import "../styles/login.css"
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginDto>({
    user_id: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await LoginApi.post("/login", formData);
      console.log("response.data:", response.data, typeof response.data);
      const token = response.data.accessToken; // NestJS에서 JWT 문자열을 그대로 반환하므로

      // JWT 저장
      localStorage.setItem("access_token", token);
      setError("");
      console.log("1차: ", localStorage.getItem("access_token"));
      // console.log("1차: ", localStorage.getItem("access_token"));
      // 홈으로 이동
      navigate("/Page");
    } catch (err: any) {
      const message = err.response?.data?.message || "로그인에 실패하였습니다.";
      setError(message);
      alert(message); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (

   <div className="login_wrap">
            <div className="login_box">
                {/* <div className="login_icon"> */}
                    <img src={Logo} alt="logo" width={361} height={259}  />
                {/* </div> */}
        {/* <form onSubmit={handleSubmit}> */}
        <div className="mb-4">
          <label className="block text-gray-700">id</label>
          <input
            type="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
                <button className="loginMngBtn" onClick={handleSubmit}>
                    <b>로그인</b>
                </button>                  
        </div>
        {/* </form> */}

    </div>
    </div>

  );
};

export default LoginPage;
