import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  name: string;

  @IsString()
  @MaxLength(80)
  @ApiProperty()
  address: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty()
  stars: number;
}
