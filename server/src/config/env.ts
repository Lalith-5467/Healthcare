import dotenv from 'dotenv';
import path from 'path';

// Load .env file from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_for_dev_only_change_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
