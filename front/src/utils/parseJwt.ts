export const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // Base64URL → Base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // 패딩 추가
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

    const payload = atob(padded);
    return JSON.parse(payload);
  } catch (e) {
    console.error("JWT parsing error:", e);
    return null;
  }
};
