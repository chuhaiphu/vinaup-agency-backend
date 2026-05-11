import { BlogCategory, Blog } from 'src/prisma/generated/client';

export class BlogCategoryBlogResponseDto {
  id: string;
  blogCategoryId: string;
  blogId: string;
  sortOrder: number;
  blogCategory?: BlogCategory;
  blog?: Blog;
}
