import {
    Controller,
    Get,
    Param,
    Post,
    Response,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/files/dto/file.dto';
import { FilesService } from './files.service';

@Controller('/')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Files')
@ApiBearerAuth()
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

  @Post('files/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
      description: 'File to upload',
      type: FileUploadDto,
  })
    uploadFile(@UploadedFile() file: FileUploadDto) {
        return this.filesService.uploadFile(file);
    }

  @Get('static/:path')
  @ApiParam({
      name: 'path',
      example: 'filename.jpg',
      description: 'Returns file by its name from `/static` folder',
  })
  downloadFile(@Param('path') path, @Response() response) {
      return response.sendFile(path, { root: './static' });
  }
}
