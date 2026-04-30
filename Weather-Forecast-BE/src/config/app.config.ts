import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
  origin: process.env.ORIGIN || 'http://localhost:5173',
}));
