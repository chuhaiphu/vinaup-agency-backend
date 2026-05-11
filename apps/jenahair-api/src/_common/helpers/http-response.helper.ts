import { HttpStatus } from '@nestjs/common';
import { HttpResponse } from '../interfaces/interface';

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: HttpStatus = HttpStatus.OK
): HttpResponse<T> {
  return {
    statusCode,
    message,
    data,
  };
}

export function createdResponse<T>(
  data: T,
  message: string = 'Created successfully'
): HttpResponse<T> {
  return {
    statusCode: HttpStatus.CREATED,
    message,
    data,
  };
}

export function noContentResponse(
  message: string = 'Deleted successfully'
): HttpResponse<void> {
  return {
    statusCode: HttpStatus.NO_CONTENT,
    message,
  };
}
