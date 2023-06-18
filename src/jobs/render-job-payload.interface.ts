import { AnyObject } from '../utils/utility-types';

export interface RenderJobPayload {
  jobGuid: string;
  archiveFileName: string;
  audioFileName: string;
  settings: AnyObject;
  projectGuid: string;
  compressedRms: number[];
  audioDurationSecs: number;
}
