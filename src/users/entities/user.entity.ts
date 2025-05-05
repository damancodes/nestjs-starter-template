import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

export enum Provider {
  GOOGLE = 'google',
  PASSWORD = 'password',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({
    nullable: true,
    type: 'text',
    comment: 'Hashed password (null if login type is Google)',
  })
  passwordHash: string | null;

  @Column({
    nullable: true,
    type: 'text',
    comment: 'Refresh or session token',
  })
  sessionToken: string | null;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.PASSWORD,
  })
  provider: Provider;

  @Column({
    default: false,
    comment: 'Has the user verified their email?',
  })
  isVerified: boolean;

  // @Column({
  //   nullable: true,
  //   comment: 'OTP or verification code (if applicable)',
  // })
  // verificationCode: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
    comment: 'Soft delete timestamp (null if not deleted)',
  })
  deletedAt: Date | null;
}
