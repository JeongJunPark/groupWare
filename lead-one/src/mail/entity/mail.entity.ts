import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'mail_master', schema: 'public' })
export class MailEntity {
  @PrimaryGeneratedColumn({ name: 'mail_id' })
  mail_id: number;

  @Column({ name: 'mail_title', type: 'varchar', length: 200 })
  mail_title: string;

  @Column({ name: 'mail_contents', type: 'text', nullable: true })
  mail_contents: string;

  // CreateDateColumn은 자동으로 DB에 DEFAULT CURRENT_TIMESTAMP 설정
  @CreateDateColumn({ name: 'mail_date', type: 'timestamp' })
  mail_date: Date;

  @Column({ name: 'mail_check_date', type: 'timestamp', nullable: true })
  mail_check_date: Date;

  @Column({ name: 'mail_size', type: 'varchar', length: 50, nullable: true })
  mail_size: string;

  @Column({ name: 'mail_attachment', type: 'varchar', length: 200, nullable: true })
  mail_attachment: string;

  @Column({ name: 'mail_sender', type: 'varchar', length: 50 })
  mail_sender: string;

  @Column({ name: 'mail_receiver', type: 'varchar', length: 500 })
  mail_receiver: string;

  @Column({ name: 'mail_type', type: 'varchar', length: 3, default: 'S' }) // 예: S=Sent
  mail_type: string;

  @Column({ name: 'mail_favorite', type: 'varchar', length: 2, default: 'N' })
  mail_favorite: string;

  @Column({ name: 'mail_ref', type: 'varchar', length: 500, nullable: true })
  mail_ref: string;

  @Column({ name: 'mail_secret_ref', type: 'varchar', length: 500, nullable: true })
  mail_secret_ref: string;
}
