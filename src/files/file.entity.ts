import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
      id: string;

  @Expose()
  @Column()
  @ApiProperty()
      path: string;
}
