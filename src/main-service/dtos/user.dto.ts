import { ProfileDto } from './profile.dto';

export class UserDto {
  guid: string;
  email: string;
  isOAuthEnabled: boolean;
  isTwoFactorAuthEnabled: boolean;

  profile: ProfileDto;
}
