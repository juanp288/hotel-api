import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncoderService {
  private readonly CRYPTO_KEY = 'cryto_defult_key';

  /**
   * Encodes a text using crypto.
   *
   * @param {string} text - The text to encode.
   * @returns {string} - Encoded text.
   */
  encode(text: string): string {
    return CryptoJS.AES.encrypt(text, this.CRYPTO_KEY).toString();
  }

  checkPassword(password: string, userPassword: string): boolean {
    const bytes = CryptoJS.AES.decrypt(userPassword, this.CRYPTO_KEY);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    return password === text;
  }
}
