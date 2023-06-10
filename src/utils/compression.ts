import { deflate, inflate } from 'node:zlib';
import { promisify } from 'node:util';

const deflateAsync = promisify(deflate);
const inflateAsync = promisify(inflate);

export const compress = async (arr: number[]): Promise<number[]> => {
  const compressedBuffer = await deflateAsync(Uint8Array.from(arr));
  return Array.from(compressedBuffer);
};

export const decompress = async (arr: number[]): Promise<number[]> => {
  const decompressed = await inflateAsync(Uint8Array.from(arr));
  return Array.from(decompressed);
};
