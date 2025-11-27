import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface Message {
  sender: string;
  message: string;
  isMe?: boolean;
  isSystem?: boolean;
}

interface ChatRoomProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);

  const token = localStorage.getItem("access_token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const nick = decoded?.user_name ? decodeURIComponent(escape(decoded.user_name)) : "익명";
  const room = "0000";

useEffect(() => {
  if (socketRef.current) return;
  const socket = io("ws://localhost:5000", {
    // path: "/ChatRoom",
    path: '/socket.io',
    transports: ["websocket"],
  });
  socketRef.current = socket;

  const handleMessage = (data: { sender: string; message: string }) => {
    setMessages(prev => [
      ...prev,
      {
        sender: data.sender,
        message: data.message,
        isMe: data.sender === nick,
        isSystem: data.sender === 'system',
      },
    ]);
  };

  socket.on("message", handleMessage);
  socket.emit("joinRoom", { nickname: nick, room });

  return () => {
    socket.off("message", handleMessage); // 반드시 해제
    socket.disconnect();
    socketRef.current = null;
  };
}, []); // 빈 배열: 마운트 시 한 번만 실행

const sendMessage = () => {
  if (!inputMsg.trim() || !socketRef.current) return;

  socketRef.current.emit("sendMessage", { room, sender: nick, message: inputMsg });

  // 화면에 바로 추가 (서버 emit는 다른 사람에게만)
  setMessages(prev => [...prev, { sender: nick, message: inputMsg, isMe: true }]);
  setInputMsg("");
};

  useEffect(() => {
    if (chatListRef.current)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [messages]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: 12,
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>채팅 ({room})</strong>
        <button onClick={onClose}>닫기</button>
      </div>

      <div
        ref={chatListRef}
        style={{
          padding: 12,
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.isMe ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: m.isSystem
                  ? "#f0f0ff"
                  : m.isMe
                  ? "#dcf8c6"
                  : "#f1f0f0",
                color: m.isSystem ? "blue" : "black",
                padding: "6px 12px",
                borderRadius: 12,
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {m.isSystem ? <em>{m.message}</em> : <span>{m.sender}: {m.message}</span>}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 12,
          borderTop: "1px solid #eee",
          display: "flex",
        }}
      >
        <input
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: 8, marginRight: 8 }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
