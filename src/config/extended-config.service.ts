import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfig, Path, PathValue } from '@nestjs/config';
import { AppConfig, appSchema } from './configuration';

// Overrides default config service to enable infer true by default
// and add all() method to retrieve all envs
// TODO: Move out to generic lib
@Injectable()
export class ExtendedConfigService<K = AppConfig> extends NestConfig<K> {
  public override get<P extends Path<K>>(path: P): PathValue<K, P> {
    const value = super.get(path, { infer: true });
    if (value === undefined) {
      throw new Error(`NotFoundConfig: ${path}`);
    }

    return value;
  }

  public all(): K {
    return Object.keys(appSchema()).reduce(
      (config, key) => ({
        ...config,
        [key]: this.get<Path<K>>(key as Path<K>)
      }),
      {} as K
    );
  }
}
