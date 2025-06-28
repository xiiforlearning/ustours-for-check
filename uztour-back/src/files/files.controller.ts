import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { File as MulterFile } from 'multer';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Upload a file to Cloudinary' })
  @ApiResponse({ status: 201, description: 'File uploaded and Cloudinary URL returned', schema: { example: { url: 'https://res.cloudinary.com/your_cloud/image/upload/v1234567890/uploads/filename.jpg' } } })
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: MulterFile) {
    const url = await this.filesService.uploadToCloudinary(file);
    return { url };
  }
} 