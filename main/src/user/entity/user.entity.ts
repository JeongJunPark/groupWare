import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_master')
export class UserEntity {
  @PrimaryColumn({ length: 100, comment: '사원ID' })
  user_id: string;

  @Column({ length: 2, comment: '권한 등급', nullable: true })
  user_grade: string;

  @Column({ length: 100, comment: '사원명', nullable: true })
  user_name: string;

  @Column({ length: 80, comment: '영문명', nullable: true })
  user_eng_name: string;

  @Column({ length: 20, comment: '휴대폰번호', nullable: true })
  cellphone_no: string;

  @Column({ length: 20, comment: '회사번호', nullable: true })
  company_telno: string;

  @Column({ length: 256, comment: '비밀번호', nullable: true })
  password: string;

  @Column({ length: 5, comment: '직급', nullable: true })
  rank: string;

  @Column({ length: 5, comment: '직책', nullable: true })
  duty: string;

  @Column({ length: 5, comment: '부서ID', nullable: true })
  dept_id: string;

  @Column({ length: 8, comment: '입사일', nullable: true })
  enter_date: string;

  @Column({ length: 8, comment: '퇴사일', nullable: true })
  resign_date: string;

  @Column({ length: 40, comment: '이메일', nullable: true })
  email: string;

  @Column({ length: 10, nullable: true })
  created_id: string;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ length: 10, nullable: true })
  updated_id: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ length: 256, nullable: true, comment: '토큰' })
  token: string;  
}
