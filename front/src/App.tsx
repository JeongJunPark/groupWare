import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./login/Login";
import Home from "./testPage/Home";
import Page from "./testPage/Page";
import { Message } from "./layout/types";
import Mail from "./mail/Mail";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]); // 전체 메시지 상태

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* MainLayout에 메시지 상태 전달 */}
        <Route element={<MainLayout messages={messages} setMessages={setMessages} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/page" element={<Page />} />
          <Route path="/mail" element={<Mail />} />
          {/* /ChatRoom 라우트는 더 이상 필요 없음 (사이드드로어로 렌더링) */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
