import { Test, TestingModule } from '@nestjs/testing';
import { EncoderService } from 'src/common/helpers/encoder.service';

describe('EncoderService', () => {
  let encoderService: EncoderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncoderService],
    }).compile();

    encoderService = module.get<EncoderService>(EncoderService);
  });

  it('should be defined', () => {
    expect(encoderService).toBeDefined();
  });

  describe('encode', () => {
    it('should return an encrypted string', () => {
      const text = 'plainText';
      const encodedText = encoderService.encode(text);

      expect(encodedText).toBeDefined();
      expect(encodedText).not.toEqual(text);
      // Verifica que el texto encriptado no sea el mismo que el texto original
    });
  });

  describe('checkPassword', () => {
    it('should return true if the password matches the encoded user password', () => {
      const password = 'password123';
      const encodedPassword = encoderService.encode(password);

      const isMatch = encoderService.checkPassword(password, encodedPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false if the password does not match the encoded user password', () => {
      const password = 'password123';
      const encodedPassword = encoderService.encode(password);

      const isMatch = encoderService.checkPassword(
        'wrongPassword',
        encodedPassword,
      );

      expect(isMatch).toBe(false);
    });

    it('should return false if the encoded user password is invalid', () => {
      const isMatch = encoderService.checkPassword(
        'password123',
        'invalidEncodedPassword',
      );

      expect(isMatch).toBe(false);
    });
  });
});
