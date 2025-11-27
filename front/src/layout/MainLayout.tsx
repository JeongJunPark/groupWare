import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatRoom from "../messenger/ChatRoom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/layout.css";
import { useState } from "react";
import { Message } from "./types"; // Message 타입 import

interface MainLayoutProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

function MainLayout({ messages, setMessages }: MainLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <Sidebar onToggleChat={toggleChat} isChatOpen={isChatOpen} />

        <div className="content-area relative">
          <Outlet />

          {/* 사이드에서 나오는 ChatRoom */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="chatroom-drawer"
              >
                <ChatRoom
                  messages={messages}
                  setMessages={setMessages}
                  onClose={toggleChat}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
