import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncoderService } from 'src/common/helpers/encoder.service';
import { UserRepository } from 'src/common/repositories/user.repo';
import { User } from 'src/common/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRoleGuard } from './guards/user-role.guard';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'secret_defult_key',
      signOptions: {
        expiresIn: '1h',
      },
      global: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    EncoderService,
    UserRepository,
    UserRoleGuard,
  ],
  exports: [JwtStrategy, PassportModule, UserRoleGuard],
})
export class AuthModule {}
