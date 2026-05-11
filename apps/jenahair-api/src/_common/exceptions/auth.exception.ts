import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class AuthExistedException extends AppException {
  constructor(message: string) {
    super('AUTH_ACCOUNT_EXISTED', message, HttpStatus.CONFLICT);
  }
}

export class TokenInvalidException extends AppException {
  constructor(message: string) {
    super('TOKEN_INVALID', message, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidCredentialsException extends AppException {
  constructor(message: string = 'Invalid credentials') {
    super('INVALID_CREDENTIALS', message, HttpStatus.UNAUTHORIZED);
  }
}
