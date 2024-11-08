import { Module } from '@nestjs/common';
import { AuthModule } from './components/auth/auth.module';
import { HotelModule } from './components/hotel/hotel.module';
import { TypeORMModule } from './common/config/typeorm.config';

@Module({
  imports: [TypeORMModule, AuthModule, HotelModule],
})
export class AppModule {}
