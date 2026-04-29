export interface User {
  id: string;
  email: string;
  fullname: string;
  username: string;
  currentCityId?: number | null;
  currentCity?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
}
