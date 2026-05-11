import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogRequestDto } from './create-blog.request.dto';

export class UpdateBlogRequestDto extends PartialType(CreateBlogRequestDto) {}
