import { User } from '../../user.entity';

export type UserProfileResponse = {
  userId: number;
  fullName: string;
  userName: string;
  email: string;
  avatar: string;
  currentCityId: number | null;
  currentCity: string;
  language: string;
  measurementType: string;
  timezone: string;
};

export function mapUserToUserProfileResponse(user: User): UserProfileResponse {
  const timezone =
    user.utc == null
      ? 'UTC+00:00'
      : `UTC${user.utc >= 0 ? '+' : ''}${user.utc}`;

  return {
    userId: user.userId,
    userName: user.username,
    fullName: user.fullname ?? '',
    email: user.email,
    avatar: user.avatar ?? '',
    currentCityId: user.current_city_fk ?? null,
    currentCity: user.currentCity?.city_name ?? '',
    language: user.nd_language,
    measurementType: user.measurement_type,
    timezone,
  };
}
