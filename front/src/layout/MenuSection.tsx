import React from "react";
import { Dropdown, Menu } from "antd";
import { Mail, Users, FileText, CheckSquare, Folder } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import "../styles/header.css";
interface MenuSectionProps {
  authList: string[];
  isMobile: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({ authList, isMobile }) => {
  const location = useLocation();  
  const mailItems = [
    // { key: '1', label: <Link to="/MyPage">My Page</Link> },
    { key: '1', label: "메일" },    
    // { key: '2', label: <Link to="/PersonalInfoModify">개인정보수정</Link> }       
  ];

  const addressItems = [
    { key: '1', label: "주소록" },    
    // { key: '2', label: <Link to="/PersonalInfoModify">개인정보수정</Link> }       
  ];

  const boardItems = [
    { key: '1', label: "게시판" },    
    // { key: '2', label: <Link to="/PersonalInfoModify">개인정보수정</Link> }       
  ];
  
  const approvalItems = [
    { key: '1', label: "결재" },    
    // { key: '2', label: <Link to="/PersonalInfoModify">개인정보수정</Link> }       
  ];
  
  const archivesItems = [
    { key: '1', label: "자료실" },    
    // { key: '2', label: <Link to="/PersonalInfoModify">개인정보수정</Link> }       
  ];  

  const isActive = (paths: string[]) => {
    return paths.some((p) => location.pathname.startsWith(p));
  };

  
  const mainMenus = [
    { icon: <Mail size={16} />, label: "메일", items: mailItems, paths: ["/mail"] },
    { icon: <Users size={16} />, label: "주소록", items: addressItems, paths: ["/address"] },
    { icon: <FileText size={16} />, label: "게시판", items: boardItems, paths: ["/board"] },
    { icon: <CheckSquare size={16} />, label: "결재", items: approvalItems, paths: ["/approval"] },
    { icon: <Folder size={16} />, label: "자료실", items: archivesItems, paths: ["/archives"] },
  ];  


  return (
    <>
      {mainMenus.map((m, i) => (
      <Dropdown
        key={i}
        menu={{ items: m.items }}
        trigger={["click"]}
        placement="bottomLeft"
        overlayClassName="custom-dropdown"
      >
        <div className={`mypage_header ${isActive(m.paths) ? "active" : ""}`}>
          {m.icon} {m.label} 
        </div>
      </Dropdown>
      ))}
    </>
  );
};

export default MenuSection;
