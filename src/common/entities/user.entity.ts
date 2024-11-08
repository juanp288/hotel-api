import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 25 })
  username: string;

  @Column({ type: 'varchar', length: 25 })
  role: string;

  @Column({ type: 'varchar', length: 25 })
  password: string;
}
