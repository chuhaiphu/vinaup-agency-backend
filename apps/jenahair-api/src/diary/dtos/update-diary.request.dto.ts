import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaryRequestDto } from './create-diary.request.dto';

export class UpdateDiaryRequestDto extends PartialType(CreateDiaryRequestDto) {}
