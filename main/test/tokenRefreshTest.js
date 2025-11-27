import React, { useEffect } from "react";
import { handleUserActivity, startInactivityTimer } from "./test/tokenTest";

function App() {
  useEffect(() => {
    const events = ["click", "keydown", "mousemove", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // 첫 진입 시 타이머 시작
    startInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  return (
    <div>
      <h1>JWT 자동갱신 + 비활성 로그아웃</h1>
    </div>
  );
}

export default App;
