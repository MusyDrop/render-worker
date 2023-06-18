import { AnyObject } from '../../utils/utility-types';

export interface RenderNecessities {
  keyframes: number[];
  audioDurationSecs: number;
  audioFilePath: string;
  renderFolderPath: string;
  outputFolderPath: string;
  settings: AnyObject;
}
