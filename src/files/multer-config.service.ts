import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

const whiteList = ['image/jpeg', 'image/gif', 'image/png', 'image/webp'];

@Injectable()
export class MulterConfigService {
    constructor(private configService: ConfigService) {}

    createMulterOptions() {
        return {
            fileFilter: (request, file, callback) => {
                if (!whiteList.includes(file.mimetype)) {
                    return callback(
                        new HttpException(
                            {
                                status: HttpStatus.UNPROCESSABLE_ENTITY,
                                errors: {
                                    file: 'cantUploadFileType',
                                },
                            },
                            HttpStatus.UNPROCESSABLE_ENTITY,
                        ),
                        false,
                    );
                }

                callback(null, true);
            },
            storage: diskStorage({
                destination: './static',
                filename: (request, file, callback) => {
                    callback(
                        null,
                        `${randomStringGenerator()}.${file.originalname
                            .split('.')
                            .pop()
                            .toLowerCase()}`,
                    );
                },
            }),
            limits: {
                fileSize: this.configService.get('file.maxFileSize'),
            },
        };
    }
}
