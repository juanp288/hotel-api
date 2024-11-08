import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from 'src/components/auth/auth.controller';
import { AuthService } from 'src/components/auth/auth.service';
import { LoginDto } from 'src/components/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            migrate: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('migrate', () => {
    it('should return migration message and users if migration is successful', async () => {
      const migrationResult = {
        msg: 'Migrado!',
        users: [
          {
            id: 1,
            username: 'testuser',
            password: 'testpassword',
            role: 'testrole',
          },
        ],
      };
      jest.spyOn(authService, 'migrate').mockResolvedValue(migrationResult);

      const result = await authController.migrate();

      expect(authService.migrate).toHaveBeenCalled();
      expect(result).toEqual(migrationResult);
    });

    it('should throw an error if migration fails', async () => {
      jest
        .spyOn(authService, 'migrate')
        .mockRejectedValue(new Error('Migration error'));

      await expect(authController.migrate()).rejects.toThrow('Migration error');
      expect(authService.migrate).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    it('should return access token if login is successful', async () => {
      const loginResult = { accessToken: 'testAccessToken' };
      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResult);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(
          new UnauthorizedException('Revise sus credenciales'),
        );

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
