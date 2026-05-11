import { Request } from 'express';

export interface HttpResponse<T> {
  message: string;
  statusCode: number;
  data?: T;
}

export interface AuthenticatedRequest extends Request {
  user: JwtValidationReturn;
}

export interface JwtValidationReturn {
  userId: string;
}

export interface JwtPayload {
  sub: string;
}

