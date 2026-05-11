import { registerAs } from '@nestjs/config';

export interface RecaptchaConfig {
  projectId: string;
  siteKey: string;
}

export default registerAs('recaptcha', (): RecaptchaConfig => {
  return {
    projectId: process.env.RECAPTCHA_PROJECT_ID || '',
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
  };
});
