export interface UserInfo {
  user_id: string;         // 사원ID
  user_grade?: string;     // 권한 등급
  user_name?: string;      // 사원명
  user_eng_name?: string;  // 영문명
  cellphone_no?: string;   // 휴대폰번호
  company_telno?: string;  // 회사번호
  password?: string;       // 비밀번호
  rank?: string;           // 직급
  duty?: string;           // 직책
  dept_id?: string;        // 부서ID
  enter_date?: string;     // 입사일
  resign_date?: string;    // 퇴사일
  email?: string;          // 이메일
  created_id?: string;
  created_at?: Date;
  updated_id?: string;
  updated_at?: Date;
  token: string;
}
