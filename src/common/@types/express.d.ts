declare namespace Express {
  import { startTime } from 'pino-http';
  import { ParsedCookiesPayload } from '../../auth/interfaces/parsed-cookies-payload.interface';
  import { UserDto } from '../../main-service/dtos/user.dto';

  export interface Request {
    /**
     * Set by cookie parser
     */
    cookies: ParsedCookiesPayload;
    /**
     * Auth token (Access token) used by auth middleware in userway BE
     */
    forwardedForIp: string;
    /**
     * JWT Payload from SSO Token
     */
    id: string;
    /**
     * Set by Auth Guards
     */
    user?: UserDto;
    accessToken?: string;
  }

  export interface Response {
    [startTime]: number;
  }
}
