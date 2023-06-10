import { Readable } from 'stream';
import bcrypt from 'bcrypt';

// TODO: Move to generic lib
export function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export const comparePasswordCandidate = async (
  passwordCandidate: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(passwordCandidate, hash);
};

export const generateBcryptHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
