import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'localhost',
  refresh_secret: process.env.JWT_REFRESH_SECRET || 'localhost',
}));
