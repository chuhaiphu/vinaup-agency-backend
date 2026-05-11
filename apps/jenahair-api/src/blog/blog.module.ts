import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlogController } from './controllers/blog.controller';
import { BlogCategoryController } from './controllers/blog-category.controller';
import { BlogCategoryBlogController } from './controllers/blog-category-blog.controller';
import { BlogService } from './services/blog.service';
import { BlogCategoryService } from './services/blog-category.service';
import { BlogCategoryBlogService } from './services/blog-category-blog.service';

@Module({
  imports: [PrismaModule],
  controllers: [BlogController, BlogCategoryController, BlogCategoryBlogController],
  providers: [BlogService, BlogCategoryService, BlogCategoryBlogService],
  exports: [BlogService, BlogCategoryService, BlogCategoryBlogService],
})
export class BlogModule {}
