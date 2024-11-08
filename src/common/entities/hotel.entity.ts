import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hotels')
export class Hotel {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 55 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 85 })
  address: string;

  @ApiProperty()
  @Column({ type: 'int' })
  stars: number;
}
