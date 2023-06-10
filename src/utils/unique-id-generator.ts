import { randomBytes } from 'crypto';

export const generateUniqueId = (): string =>
  randomBytes(9).toString('base64url');
