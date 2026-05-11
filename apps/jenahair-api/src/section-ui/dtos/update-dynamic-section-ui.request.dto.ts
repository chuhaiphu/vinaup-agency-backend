import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicSectionUIRequestDto } from './create-dynamic-section-ui.request.dto';

export class UpdateDynamicSectionUIRequestDto extends PartialType(
  CreateDynamicSectionUIRequestDto,
) {}
