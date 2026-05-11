// src/recaptcha/recaptcha.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import recaptchaConfig from 'src/_core/configs/recaptcha.config';

@Injectable()
export class RecaptchaService {
  private client: RecaptchaEnterpriseServiceClient;
  private readonly logger = new Logger(RecaptchaService.name);

  constructor(
    @Inject(recaptchaConfig.KEY)
    private readonly config: ConfigType<typeof recaptchaConfig>
  ) {
    this.client = new RecaptchaEnterpriseServiceClient();
  }

  async verifyToken(token: string, action: string): Promise<boolean> {
    const projectID = this.config.projectId;
    const recaptchaKey = this.config.siteKey;

    if (!projectID || !recaptchaKey) {
      this.logger.error('Missing reCAPTCHA configuration');
      return false;
    }

    try {
      const projectPath = this.client.projectPath(projectID);

      const request = {
        assessment: {
          event: {
            token: token,
            siteKey: recaptchaKey,
            expectedAction: action,
          },
        },
        parent: projectPath,
      };

      const [response] = await this.client.createAssessment(request);
      if (!response) {
        this.logger.error('No response from reCAPTCHA Enterprise');
        return false;
      }
      if (!response.tokenProperties) {
        this.logger.error('No token properties in reCAPTCHA Enterprise response');
        return false;
      }
      if (!response.riskAnalysis) {
        this.logger.error('No risk analysis in reCAPTCHA Enterprise response');
        return false;
      }
      if (!response.tokenProperties.valid) {
        this.logger.error(
          `Invalid token: ${response.tokenProperties.invalidReason}`
        );
        return false;
      }
      if (response.event?.expectedAction !== action) {
        this.logger.error(
          `Action mismatch: expected ${action}, got ${response.tokenProperties.action}`
        );
        return false;
      }
      if (!response.riskAnalysis.score) {
        this.logger.error('No risk score in reCAPTCHA Enterprise response');
        return false;
      }
      const MINIMUM_SCORE = 0.5;
      return response.riskAnalysis.score >= MINIMUM_SCORE;
    } catch (error) {
      this.logger.error('Error verifying reCAPTCHA Enterprise', error);
      return false;
    }
  }
}
