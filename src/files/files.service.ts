import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { File } from './file.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
  ) {}

  async uploadFile(payload): Promise<File> {
    if (!payload) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'incorrectSelectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const file = this.entityManager.create(File, {
      path: payload.path,
    });

    await this.entityManager.save(file);

    return file;
  }
}
