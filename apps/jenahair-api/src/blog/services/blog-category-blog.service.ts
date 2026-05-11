import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogCategoryBlogRequestDto } from 'src/blog/dtos/create-blog-category-blog.request.dto';
import { UpdateBlogCategoryBlogRequestDto } from 'src/blog/dtos/update-blog-category-blog.request.dto';
import { BlogCategoryBlogResponseDto } from 'src/blog/dtos/blog-category-blog.response.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class BlogCategoryBlogService {
  constructor(private prismaService: PrismaService) {}

  async create(
    dto: CreateBlogCategoryBlogRequestDto,
  ): Promise<BlogCategoryBlogResponseDto> {
    try {
      const relation = await this.prismaService.blogCategoryBlog.create({
        data: {
          blogCategoryId: dto.blogCategoryId,
          blogId: dto.blogId,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: {
          blogCategory: {
            include: {
              parent: true,
              children: true,
            },
          },
          blog: {
            include: {
              createdBy: true,
              blogCategoryBlogs: true,
            },
          },
        },
      });

      return relation;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Relation between this blog category and blog already exists',
        );
      }
      throw error;
    }
  }

  async findById(id: string): Promise<BlogCategoryBlogResponseDto> {
    const relation = await this.prismaService.blogCategoryBlog.findUnique({
      where: { id },
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    if (!relation) {
      throw new NotFoundException('Blog-category-blog relation not found');
    }

    return relation;
  }

  async findByBlogId(blogId: string): Promise<BlogCategoryBlogResponseDto[]> {
    const relations = await this.prismaService.blogCategoryBlog.findMany({
      where: { blogId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return relations;
  }

  async findByBlogCategoryId(
    blogCategoryId: string,
  ): Promise<BlogCategoryBlogResponseDto[]> {
    const relations = await this.prismaService.blogCategoryBlog.findMany({
      where: { blogCategoryId },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return relations;
  }

  async findAll(): Promise<BlogCategoryBlogResponseDto[]> {
    const relations = await this.prismaService.blogCategoryBlog.findMany({
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return relations;
  }

  async update(
    id: string,
    dto: UpdateBlogCategoryBlogRequestDto,
  ): Promise<BlogCategoryBlogResponseDto> {
    const relation = await this.prismaService.blogCategoryBlog.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Blog-category-blog relation not found');
    }

    const updatedRelation = await this.prismaService.blogCategoryBlog.update({
      where: { id },
      data: {
        sortOrder: dto.sortOrder,
      },
      include: {
        blogCategory: {
          include: {
            parent: true,
            children: true,
          },
        },
        blog: {
          include: {
            createdBy: true,
            blogCategoryBlogs: true,
          },
        },
      },
    });

    return updatedRelation;
  }

  async delete(id: string): Promise<void> {
    const relation = await this.prismaService.blogCategoryBlog.findUnique({
      where: { id },
    });

    if (!relation) {
      throw new NotFoundException('Blog-category-blog relation not found');
    }

    await this.prismaService.blogCategoryBlog.delete({
      where: { id },
    });
  }

  async deleteByBlogId(blogId: string): Promise<void> {
    await this.prismaService.blogCategoryBlog.deleteMany({
      where: { blogId },
    });
  }

  async deleteByBlogCategoryId(blogCategoryId: string): Promise<void> {
    await this.prismaService.blogCategoryBlog.deleteMany({
      where: { blogCategoryId },
    });
  }
}
