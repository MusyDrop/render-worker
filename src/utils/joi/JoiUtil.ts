import Joi, { SchemaMap } from 'joi';
import { AnyObject } from '../utility-types';
import { JoiConfig, JoiConfigProps } from './joiTypes';

// TODO: Move to generic library
// TODO: Make logger injectable from a third party
export class JoiUtil {
  /**
   * Validates Joi schema from supplied config with values
   * @param config supplied config with values
   */
  public static validate<T extends AnyObject>(config: JoiConfig<T>): T {
    // validation schema without undefineds
    const schemaMap = this.extractByPropName<T, SchemaMap<T, true>>(
      config,
      'schema'
    );

    const values = this.extractByPropName<T, T>(config, 'value');

    const schema = Joi.object(schemaMap);

    const { error } = schema.validate(values, { allowUnknown: true });

    if (error) {
      console.error(`Configuration error: ${error.annotate()}`);
      throw error;
    }

    return values;
  }

  /**
   * Extracts schema from JoiConfig avoiding explicit undefineds
   * @param config Joi config to retrieve schema from
   * @param propName name of the prop to extract
   */
  private static extractByPropName<T, R extends SchemaMap<T, true> | T>(
    config: JoiConfig<T>,
    propName: keyof JoiConfigProps<T>
  ): R {
    return Object.keys(config).reduce((schema, key) => {
      const typedKey = key as keyof JoiConfig<T>;

      if (this.isNested(config[typedKey])) {
        return {
          ...schema,
          [key]: this.extractByPropName<T, R>(
            config[typedKey] as unknown as JoiConfig<T>,
            propName
          )
        };
      }

      const candidate = (config[typedKey] as unknown as JoiConfigProps<T>)[
        propName
      ];

      // if it's undefined it's definitely joi config
      if (candidate === undefined) {
        return schema;
      }

      return {
        ...schema,
        [key]: candidate
      };
    }, {} as R);
  }

  private static isNested(candidate: AnyObject): boolean {
    const joiConfigProps = candidate as JoiConfigProps<unknown>;

    return !joiConfigProps.schema && !joiConfigProps.value;
  }
}
