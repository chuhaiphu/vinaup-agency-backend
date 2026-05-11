import { BlogCategoryBlog, User } from 'src/prisma/generated/client';

export class BlogResponseDto {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  country: string;
  destinations: string[];
  endpoint: string;
  visibility: string;
  sortOrder: number;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  videoPosition: string | null;
  mainImageUrl: string | null;
  additionalImageUrls: string[];
  additionalImagesPosition: string | null;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: User | null;
  blogCategoryBlogs?: BlogCategoryBlog[];
}
