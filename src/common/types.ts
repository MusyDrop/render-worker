import { AnyFunction, AnyObject } from '../utils/utility-types';

// TODO: Move out to a generic Lib
export type ResponseDtoMapper<T extends AnyObject> = {
  [K in keyof T as T[K] extends AnyFunction
    ? `${Extract<K, string>}Mapper`
    : never]: T[K] extends (...args: any[]) => infer R
    ? (...args: any[]) => Awaited<R>
    : never;
};
