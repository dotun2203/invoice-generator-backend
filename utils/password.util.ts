import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export const hashPassword = async (password: any) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  plainPassword: any,
  hashedPassword: any,
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export function generateVerificationToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString('hex');
        resolve(token);
      }
    });
  });
}
