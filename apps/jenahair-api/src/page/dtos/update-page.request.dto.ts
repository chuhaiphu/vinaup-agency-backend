import { PartialType } from '@nestjs/mapped-types';
import { CreatePageRequestDto } from './create-page.request.dto';

export class UpdatePageRequestDto extends PartialType(CreatePageRequestDto) {}
