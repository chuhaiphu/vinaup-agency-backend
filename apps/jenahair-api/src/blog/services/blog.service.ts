import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogRequestDto } from 'src/blog/dtos/create-blog.request.dto';
import { UpdateBlogRequestDto } from 'src/blog/dtos/update-blog.request.dto';
import { BlogFilterParamDto } from 'src/blog/dtos/blog-filter.param.dto';
import { Prisma } from 'src/prisma/generated/client';
import { BlogResponseDto } from 'src/blog/dtos/blog.response.dto';

@Injectable()
export class BlogService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateBlogRequestDto, userId?: string): Promise<BlogResponseDto> {
    const existing = await this.prismaService.blog.findUnique({
      where: { endpoint: dto.endpoint },
    });

    if (existing) {
      throw new ConflictException('Blog with this endpoint already exists');
    }

    const { categoryIds, userId: dtoUserId, ...blogData } = dto;

    const blog = await this.prismaService.blog.create({
      data: {
        ...blogData,
        createdByUserId: dtoUserId || userId || undefined,
        blogCategoryBlogs: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId, index) => ({
                blogCategoryId: categoryId,
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return blog ;
  }

  async findAll(filter: BlogFilterParamDto): Promise<BlogResponseDto[]> {
    const where: Prisma.BlogWhereInput = {};

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.visibility) {
      where.visibility = filter.visibility;
    }

    if (filter.categoryId) {
      where.blogCategoryBlogs = {
        some: { blogCategoryId: filter.categoryId },
      };
    }

    const blogs = await this.prismaService.blog.findMany({
      where,
      orderBy: [
        { updatedAt: 'desc' },
        { sortOrder: 'asc' },
      ],
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return blogs;
  }

  async findAllPublic(filter: BlogFilterParamDto): Promise<BlogResponseDto[]> {
    const where: Prisma.BlogWhereInput = {
      visibility: 'public',
    };

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.categoryId) {
      where.blogCategoryBlogs = {
        some: { blogCategoryId: filter.categoryId },
      };
    }

    const blogs = await this.prismaService.blog.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return blogs;
  }

  async findAllPublicBlogsPinnedToHome(): Promise<BlogResponseDto[]> {
    const blogs = await this.prismaService.blog.findMany({
      where: {
        visibility: 'public',
        sortOrder: {
          not: -1,
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return blogs;
  }

  async findBlogsByUserId(userId: string): Promise<BlogResponseDto[]> {
    const blogs = await this.prismaService.blog.findMany({
      where: {
        createdByUserId: userId,
      },
      orderBy: [
        { updatedAt: 'desc' },
      ],
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return blogs;
  }

  async hasViewedToday(blogId: string, ipAddress: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const view = await this.prismaService.blogView.findFirst({
      where: {
        blogId,
        ipAddress,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return !!view;
  }

  async hasLiked(blogId: string, ipAddress: string): Promise<boolean> {
    const like = await this.prismaService.blogLike.findUnique({
      where: {
        blogId_ipAddress: {
          blogId,
          ipAddress,
        },
      },
    });

    return !!like;
  }

  async findById(id: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog ;
  }

  async findByEndpoint(endpoint: string): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { endpoint, visibility: 'public' },
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog ;
  }

  async update(id: string, dto: UpdateBlogRequestDto): Promise<BlogResponseDto> {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (dto.endpoint && dto.endpoint !== blog.endpoint) {
      const existing = await this.prismaService.blog.findUnique({
        where: { endpoint: dto.endpoint },
      });
      if (existing) {
        throw new ConflictException('Blog with this endpoint already exists');
      }
    }

    const { categoryIds, ...blogData } = dto;

    if (categoryIds !== undefined) {
      await this.prismaService.blogCategoryBlog.deleteMany({
        where: { blogId: id },
      });

      if (categoryIds.length > 0) {
        await this.prismaService.blogCategoryBlog.createMany({
          data: categoryIds.map((categoryId, index) => ({
            blogId: id,
            blogCategoryId: categoryId,
            sortOrder: index,
          })),
        });
      }
    }

    const updatedBlog = await this.prismaService.blog.update({
      where: { id },
      data: blogData,
      include: {
        createdBy: true,
        blogCategoryBlogs: {
          include: {
            blogCategory: {
              include: {
                parent: true,
                children: true,
              },
            },
          },
        },
      },
    });

    return updatedBlog ;
  }

  async delete(id: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.prismaService.blog.delete({
      where: { id },
    });
  }

  async incrementView(id: string, ipAddress: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingView = await this.prismaService.blogView.findFirst({
      where: {
        blogId: id,
        ipAddress,
        viewedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!existingView) {
      await this.prismaService.$transaction(async (tx) => {
        await tx.blogView.create({
          data: {
            blogId: id,
            ipAddress,
          },
        });
        await tx.blog.update({
          where: { id },
          data: { views: { increment: 1 } },
        });
      });
    }

    return { success: true };
  }

  async toggleLike(id: string, ipAddress: string) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const existingLike = await this.prismaService.blogLike.findUnique({
      where: {
        blogId_ipAddress: {
          blogId: id,
          ipAddress,
        },
      },
    });

    if (existingLike) {
      await this.prismaService.$transaction(async (tx) => {
        await tx.blogLike.delete({
          where: {
            blogId_ipAddress: {
              blogId: id,
              ipAddress,
            },
          },
        });
        await tx.blog.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        });
      });
      return { liked: false };
    } else {
      await this.prismaService.$transaction(async (tx) => {
        await tx.blogLike.create({
          data: { blogId: id, ipAddress },
        });
        await tx.blog.update({
          where: { id },
          data: { likes: { increment: 1 } },
        });
      });
      return { liked: true };
    }
  }
}
