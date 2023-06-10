import { Schema } from 'joi';
import { AnyObject } from '../utility-types';

export type JoiConfigProps<ValueType> = {
  value: ValueType;
  schema?: Schema;
};

export type JoiConfigValue<ValueType> = ValueType extends AnyObject
  ? ValueType extends ArrayLike<any>
    ? JoiConfigProps<ValueType>
    : JoiConfig<ValueType>
  : JoiConfigProps<ValueType>;

export type JoiConfig<ConfigType> = {
  [K in keyof ConfigType]: JoiConfigValue<ConfigType[K]>;
};

export type JoiAppConfig<Interface> = {
  [K in keyof Interface]: JoiConfig<unknown>;
};
