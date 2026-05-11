import { SectionUICredentialsResponseDto } from './section-ui-credentials.response.dto';

export class DynamicSectionUIResponseDto {
  id: string;
  position: number;
  sectionUICredentialsId: string | null;
  sectionUICredentials?: SectionUICredentialsResponseDto | null;
  properties: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
