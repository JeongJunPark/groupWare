import React, { useState, useEffect } from "react";
import CallAPI from "../testApi/CallAPI";
import { parseJwt } from "../utils/parseJwt";


const Page: React.FC = () => {
  const [city, setCity] = useState("Seoul");
  const [data, setData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null); 

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (decoded) {

      const fixedName = decodeURIComponent(escape(decoded.user_name));

      setUserInfo({
        id: decoded.user_id,
        name: fixedName,
        email: decoded.email,
      });

      console.log("로그인한 유저 정보:", {
        id: decoded.user_id,
        name: fixedName,
        email: decoded.email,
      });
    }
  }, []);

  const handleFetch = async () => {
    try {
      const res = await CallAPI(city);
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        {userInfo ? (
          <div style={{ marginBottom: "20px" }}>
            <h3>로그인한 유저 정보</h3>
            <p>
              <strong>ID:</strong> {userInfo.id}
            </p>
            <p>
              <strong>이름:</strong> {userInfo.name}
            </p>
            <p>
              <strong>이메일:</strong> {userInfo.email}
            </p>
          </div>
        ) : (
          <p>로그인 정보 없음</p>
        )}

        <input
          type="text"
          placeholder="region"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={handleFetch}>Fetch Weather</button>

        <div style={{ marginTop: "20px" }}>
          {data && (
            <div>
              <p>City: {data.name}</p>
              <p>Temperature: {data.main?.temp}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
