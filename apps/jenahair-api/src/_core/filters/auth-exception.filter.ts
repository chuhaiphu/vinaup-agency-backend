import { TokenInvalidException } from 'src/_common/exceptions/auth.exception';
import { Catch, ExceptionFilter, ArgumentsHost, Inject } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import type { ConfigType } from '@nestjs/config';
import authConfig from '../configs/auth.config';

@Catch(TokenInvalidException, UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) { }

  catch(
    exception: TokenInvalidException | UnauthorizedException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.clearCookie(this.authConf.cookies.accessToken.name, {
      ...this.authConf.cookies.accessToken.options,
    });
    // use getResponse() to preserve full response body { error, message, statusCode }
    response.status(exception.getStatus()).json(exception.getResponse());
  }
}
