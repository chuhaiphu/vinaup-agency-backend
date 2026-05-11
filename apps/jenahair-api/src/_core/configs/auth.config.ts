import { registerAs } from '@nestjs/config';
import { CookieOptions } from 'express';
import { ONE_DAY } from 'src/_common/constants/time.constant';
import {
  CLIENT_URL_LOCAL,
  CLIENT_URL_PRODUCTION,
} from 'src/_common/constants/uri.constant';

export interface AuthConfig {
  isProduction: boolean;
  cors: {
    origin: string[];
  };
  cookies: {
    accessToken: {
      name: string;
      options: CookieOptions;
    };
  };
  jwt: {
    secret: string;
    expiresIn: number;
  };
  defaultValue: {
    supAdminEmail: string;
    supAdminPassword: string;
    defaultPassword?: string;
  };
}

export default registerAs('auth', (): AuthConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = [CLIENT_URL_PRODUCTION, CLIENT_URL_LOCAL];
  const supAdminEmail = process.env.SUPADMIN_EMAIL;
  const supAdminPassword = process.env.SUPADMIN_PASSWORD;
  return {
    isProduction,
    cors: {
      origin: allowedOrigins,
    },
    cookies: {
      accessToken: {
        name: 'atk',
        options: {
          httpOnly: true,
          secure: true,
          sameSite: isProduction ? 'lax' : 'none',
          maxAge: ONE_DAY * 7,
        },
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET || '',
      expiresIn: ONE_DAY * 7,
    },
    defaultValue: {
      supAdminEmail: supAdminEmail || '',
      supAdminPassword: supAdminPassword || '',
      defaultPassword: 'jenaHair@2026',
    },
  };
});
