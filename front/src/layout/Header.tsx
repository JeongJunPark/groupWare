import React, { useState } from "react";
import { Button, Drawer } from "antd";
import { Menu } from "lucide-react"; // 햄버거 아이콘
import { LogOut, User } from "lucide-react";
// import Logo from "../assets/logo.png";
import MenuSection from "./MenuSection";
import "../styles/header.css";

interface HeaderProps {
  authList: string[];
  ID: string;
  name?: string;
}

const Header: React.FC<HeaderProps> = ({ authList, ID, name }) => {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="header-container">
        {/* 로고 */}
        <div
          className="mypage_header"
          onClick={() => (window.location.href = "/home")}
        >
          {/* <img src={Logo} alt="logo" width={100} height={40} /> */}
        logo
        </div>

        {/* 데스크탑 메뉴 */}
        <div className="desktop-menu">
          <MenuSection authList={authList} isMobile={false} />
        </div>

        {/* 우측 사용자 영역 */}
        <div className="menu-right">
          <div className="mypage_header user-menu">
            <User size={16} /> {ID} {name && `(${name})`}
          </div>

        <div
        className="logout"
        onClick={() => console.log("로그아웃 클릭됨")}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
        <LogOut size={16} />
        <span style={{ marginLeft: 4 }}>로그아웃</span>
        </div>
        </div>

        {/* 모바일 메뉴 버튼 */}
        {/* <Button
          className="mobile-menu-btn"
          type="text"
          icon={<Menu size={18} color="white" />}
          onClick={() => setOpen(true)}
        /> */}

        {/* Drawer */}
        {/* <Drawer
          title="메뉴"
          placement="left"
          onClose={() => setOpen(false)}
          open={open}
        >
          <MenuSection authList={authList} isMobile={true} />
        </Drawer> */}
      </div>
    </header>
  );
};

export default Header;
