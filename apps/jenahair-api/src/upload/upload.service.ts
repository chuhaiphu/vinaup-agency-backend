import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import uploadConfig from 'src/_core/configs/upload.config';
import { UploadResponseDto } from 'src/upload/dtos/upload.response.dto';
import { generateUniqueCode } from 'src/_common/helpers/code-generator.helper';

@Injectable()
export class UploadService {
  constructor(
    @Inject(uploadConfig.KEY)
    private readonly config: ConfigType<typeof uploadConfig>,
  ) { }

  async uploadImage(file: Express.Multer.File, filePath: string, folderPath: string) {
    // Create folder and save file
    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(filePath, file.buffer);
  }

  async uploadImageByCurrentUser(
    userId: string,
    file: Express.Multer.File,
    folder?: string
  ): Promise<UploadResponseDto> {
    // Validate
    if (!file) throw new BadRequestException('File is required');
    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }
    if (file.size > this.config.maxFileSize) {
      throw new BadRequestException('File too large');
    }

    // Generate filename
    const ext = file.originalname.split('.').pop() || 'jpg';
    const filename = `${generateUniqueCode()}.${ext}`;

    // Create paths
    const uploadFolderPath = join(this.config.uploadPath, `user_${userId}`, folder ?? "");
    const filePath = join(uploadFolderPath, filename);
    await this.uploadImage(file, filePath, uploadFolderPath);

    const responseFolderPath = join(`user_${userId}`, folder ?? "")
    return {
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${this.config.mediaBaseUrl}/${responseFolderPath}/${filename}`,
      path: `${folder}/${filename}`,
      uploadedAt: new Date().toISOString(),
    };
  }

  async deleteFile(relativePath: string): Promise<void> {
    if (!relativePath) throw new BadRequestException('Path is required');
    const filePath = join(this.config.uploadPath, relativePath);
    try {
      await fs.unlink(filePath);
    }
    catch (error) {
      if (error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new BadRequestException('File not found');
      }
    }
  }
}
