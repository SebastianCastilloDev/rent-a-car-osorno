import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
}));


