import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from 'src/common/entities/hotel.entity';
import { HotelRepository } from 'src/common/repositories/hotel.repo';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelController],
  providers: [HotelService, HotelRepository],
})
export class HotelModule {}
