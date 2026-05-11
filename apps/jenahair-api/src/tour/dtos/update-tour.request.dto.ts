import { PartialType } from '@nestjs/mapped-types';
import { CreateTourRequestDto } from './create-tour.request.dto';

export class UpdateTourRequestDto extends PartialType(CreateTourRequestDto) {}
