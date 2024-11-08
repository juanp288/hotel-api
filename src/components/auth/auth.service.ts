import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncoderService } from 'src/common/helpers/encoder.service';
import { LoginDto } from './dto/login.dto';
import { LoginResposeDto } from './dto/response/login-response.dto';
import { UserRepository } from 'src/common/repositories/user.repo';
import { DEF_USERS } from 'src/common/constants/users';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly encoderService: EncoderService,
    private readonly jwtService: JwtService,
  ) {}

  async migrate() {
    await this.userRepository.clear();
    await this.userRepository.save(this.userRepository.create(DEF_USERS));
    return { msg: 'Migrado!', users: DEF_USERS };
  }

  async login(loginDto: LoginDto): Promise<LoginResposeDto> {
    let { username, password } = loginDto;

    const user = await this.userRepository.findOneByUsername(username);
    if (!user) this.showInvaledCredsError();

    const passwordIsValid = this.encoderService.checkPassword(
      password,
      user.password,
    );

    if (!passwordIsValid) this.showInvaledCredsError();

    delete user.password;

    return {
      accessToken: this.jwtService.sign({ user }),
    };
  }

  private showInvaledCredsError() {
    throw new UnauthorizedException('Revise sus credenciales');
  }
}
