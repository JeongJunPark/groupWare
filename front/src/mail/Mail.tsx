import React, { useState, useEffect } from "react";
import MailSidebar from "./MailSidebar";
import "../styles/mail.css"; // 위 CSS를 여기에 둠
import { parseJwt } from "../utils/parseJwt";
type MailFolder =
  | "메일쓰기"
  | "전체메일"
  | "보낸메일"
  | "받은메일"
  | "임시보관"
  | "스팸메일"
  | "삭제메일";


  
const Mail: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<MailFolder>("전체메일");
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
  
  
  return (
    <div className="mail-page">
      <MailSidebar selected={selectedFolder} onSelect={setSelectedFolder} />

      <div className="mail-content">
        <h2>{selectedFolder}</h2>

        {selectedFolder === "메일쓰기" ? (
          <div>
            <label>
              받는사람:
              <input type="text" style={{ width: "100%", marginTop: 6 }} />
            </label>
            <label style={{ display: "block", marginTop: 10 }}>
              제목:
              <input type="text" style={{ width: "100%", marginTop: 6 }} />
            </label>
            <label style={{ display: "block", marginTop: 10 }}>
              내용:
              <textarea style={{ width: "100%", height: 200, marginTop: 6 }} />
            </label>
            <button style={{ marginTop: 10 }}>전송</button>
          </div>
        ) : (
          <div>
            {/* 각 폴더에 따라 리스트 렌더링 (샘플) */}
            <p>여기는 <strong>{selectedFolder}</strong> 목록입니다.</p>
            <ul>
              <li>샘플 메일 1</li>
              <li>샘플 메일 2</li>
              <li>샘플 메일 3</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mail;