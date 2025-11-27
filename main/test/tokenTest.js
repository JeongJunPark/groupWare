import axios from "axios";
import jwt_decode from "jwt-decode";

const API_URL = "http://localhost:4000/auth";
let inactivityTimer;

export function getRemainingTime(token) {
  if (!token) return 0;
  const decoded = jwt_decode(token);
  const now = Date.now();
  const exp = decoded.exp * 1000;
  return Math.max(0, exp - now);
}

export async function refreshToken() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await axios.post(`${API_URL}/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem("token", res.data.token);
    console.log("🔄 토큰 갱신 완료");
  } catch (err) {
    console.log("⚠️ 토큰 갱신 실패");
    logoutUser();
  }
}

export function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    console.log("⏰ 비활성 상태 -> 자동 로그아웃");
    logoutUser();
  }, 60 * 60 * 1000); // 1시간
}

export function handleUserActivity() {
  const remaining = getRemainingTime(localStorage.getItem("token"));
  console.log(`⏳ 남은시간: ${Math.floor(remaining / 1000)}초`);

  if (remaining < 5 * 60 * 1000) {
    refreshToken();
  }

  startInactivityTimer();
}

export function logoutUser() {
  const token = localStorage.getItem("token");
  if (token) {
    axios.post(`${API_URL}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  localStorage.removeItem("token");
  window.location.href = "/login";
}
