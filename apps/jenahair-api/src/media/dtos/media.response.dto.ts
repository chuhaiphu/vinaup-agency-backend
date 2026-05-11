export class MediaResponseDto {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  url: string;
  type: string;
  folder: string;
  createdAt: Date;
  updatedAt: Date;
}
