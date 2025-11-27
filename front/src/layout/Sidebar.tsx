import React, { useState } from "react";
import {
  Mail,
  Users,
  FileText,
  CheckSquare,
  Folder,
  Menu as MenuIcon,
  Calendar,
  Clock,
  MessageSquare,
} from "lucide-react";
import "../styles/sidebar.css";
import Logo from "../static/images/leadcorp_img.svg";
import { Link } from "react-router-dom"

interface SidebarProps {
  onToggleChat: () => void; // 메신저 열기/닫기
  isChatOpen: boolean;       // 메신저 상태
}

const Sidebar: React.FC<SidebarProps> = ({ onToggleChat, isChatOpen }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menus = [
    { icon: <Mail size={18} />, label: <Link to="/Mail">메일</Link> },
    { icon: <Users size={18} />, label: "주소록" },
    { icon: <FileText size={18} />, label: "게시판" },
    { icon: <CheckSquare size={18} />, label: "결재" },
    { icon: <Folder size={18} />, label: "자료실" },
    { icon: <Calendar size={18} />, label: "캘린더" },
    { icon: <Clock size={18} />, label: "근태관리" },
    { icon: <MessageSquare size={18} />, label: "메신저", onClick: onToggleChat },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon size={18} />
      </div>

      {isOpen && (
        <div className="sidebar-logo">
          <img src={Logo} alt="logo" width={78} height={18} />
        </div>
      )}

      {menus.map((menu, i) => (
        <button
          key={i}
          className={`sidebar-item ${menu.label === "메신저" && isChatOpen ? "active" : ""}`}
          onClick={menu.onClick}
        >
          {menu.icon}
          {isOpen && <span style={{ marginLeft: 8 }}>{menu.label}</span>}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
