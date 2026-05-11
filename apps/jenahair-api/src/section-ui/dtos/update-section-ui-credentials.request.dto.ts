import { PartialType } from '@nestjs/mapped-types';
import { CreateSectionUICredentialsRequestDto } from './create-section-ui-credentials.request.dto';

export class UpdateSectionUICredentialsRequestDto extends PartialType(
  CreateSectionUICredentialsRequestDto,
) {}
