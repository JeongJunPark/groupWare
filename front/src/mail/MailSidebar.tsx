// MailSidebar.tsx
import React from "react";

type MailFolder =
  | "메일쓰기"
  | "전체메일"
  | "보낸메일"
  | "받은메일"
  | "임시보관"
  | "스팸메일"
  | "삭제메일";

interface MailSidebarProps {
  selected: MailFolder;
  onSelect: (f: MailFolder) => void;
}

const folders: MailFolder[] = [
  "메일쓰기",
  "전체메일",
  "보낸메일",
  "받은메일",
  "임시보관",
  "스팸메일",
  "삭제메일",
];

const MailSidebar: React.FC<MailSidebarProps> = ({ selected, onSelect }) => {
  return (
    <div className="mail-sidebar">
      {folders.map((f) => (
        <div
          key={f}
          className={`mail-sidebar-item ${selected === f ? "active" : ""}`}
          onClick={() => onSelect(f)}
        >
          {f}
        </div>
      ))}
    </div>
  );
};

export default MailSidebar;
