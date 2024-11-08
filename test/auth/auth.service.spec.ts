import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from 'src/common/repositories/user.repo';
import { EncoderService } from 'src/common/helpers/encoder.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { DEF_USERS } from 'src/common/constants/users';
import { AuthService } from 'src/components/auth/auth.service';
import { LoginDto } from 'src/components/auth/dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let encoderService: EncoderService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            clear: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: EncoderService,
          useValue: {
            checkPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    encoderService = module.get<EncoderService>(EncoderService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('migrate', () => {
    it('should clear the user repository and save default users', async () => {
      const clearSpy = jest.spyOn(userRepository, 'clear');
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(undefined);

      const result = await authService.migrate();

      expect(clearSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalledWith(userRepository.create(DEF_USERS));
      expect(result).toEqual({ msg: 'Migrado!', users: DEF_USERS });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'password123',
    };
    const user = {
      id: 1,
      username: 'testuser',
      password: 'password123',
      role: 'testRole',
    };

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(user);
      jest.spyOn(encoderService, 'checkPassword').mockReturnValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(encoderService.checkPassword).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
    });

    it('should return access token if credentials are valid', async () => {
      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(user);
      jest.spyOn(encoderService, 'checkPassword').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('testAccessToken');

      const { password } = loginDto;
      const result = await authService.login(loginDto);

      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(encoderService.checkPassword).toHaveBeenCalledWith(
        loginDto.password,
        password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        user: { id: user.id, username: user.username, role: user.role },
      });
      expect(result).toEqual({ accessToken: 'testAccessToken' });
    });
  });
});
