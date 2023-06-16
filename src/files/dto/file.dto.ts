import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseEntityDto } from 'src/base/base-entity.dto';
import { File } from '../file.entity';

export class FileDto extends BaseEntityDto<File, FileDto>() {
  @Expose() path: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
