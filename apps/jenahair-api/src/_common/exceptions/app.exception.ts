import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(error: string, message: string, status: HttpStatus) {
    super(
      {
        error: error,
        message: message,
        statusCode: status,
      },
      status
    );
  }
}
