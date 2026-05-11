import { IsOptional, IsString } from 'class-validator';

export class CarouselSlideItemDto {
    @IsString()
    id: string;

    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsString()
    href?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    subTitle?: string;
}
