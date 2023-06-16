import { GoogleRecaptchaException } from '@nestlab/google-recaptcha';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(GoogleRecaptchaException)
export class GoogleRecaptchaFilter implements ExceptionFilter {
  catch(exception: GoogleRecaptchaException, host: ArgumentsHost): any {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();

    response.status(status).send({
      statusCode: exception.getStatus(),
      message: 'incorrectRecaptcha',
      error:
        exception.getStatus() === HttpStatus.BAD_REQUEST
          ? 'Bad request'
          : 'Internal server error',
    });
  }
}
