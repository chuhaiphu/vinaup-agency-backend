import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Response } from 'express';
import authConfig from 'src/_core/configs/auth.config';
import { AuthService } from './auth.service';
import { LocalSignInRequestDto } from 'src/auth/dtos/local-signin.request.dto';
import type { HttpResponse } from 'src/_common/interfaces/interface';
import { AuthResponseDto } from 'src/auth/dtos/auth.response.dto';
import { JwtAuthGuard } from 'src/_core/guards/jwt-auth.guard';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { JwtValidationReturn } from 'src/_common/interfaces/interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) { }

  @Post('local')
  async localSignIn(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LocalSignInRequestDto
  ): Promise<HttpResponse<AuthResponseDto>> {
    const authResult = await this.authService.localSignIn(dto);

    response.cookie(
      this.authConf.cookies.accessToken.name,
      authResult.accessToken,
      this.authConf.cookies.accessToken.options
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Authentication completed successfully',
      data: authResult,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): HttpResponse<void> {
    response.clearCookie(
      this.authConf.cookies.accessToken.name,
      this.authConf.cookies.accessToken.options
    );

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Signed out successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<AuthResponseDto['user']>> {
    const userData = await this.authService.validateUser(user.userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'User data retrieved successfully',
      data: userData,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @CurrentUser() user: JwtValidationReturn
  ): Promise<HttpResponse<void>> {
    await this.authService.resetPassword(user.userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password has been reset successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password/:userId')
  async resetPasswordForUser(
    @CurrentUser() user: JwtValidationReturn,
    @Param('userId') targetUserId: string
  ): Promise<HttpResponse<void>> {
    await this.authService.resetPasswordForUser(user.userId, targetUserId);

    return {
      statusCode: HttpStatus.OK,
      message: 'User password has been reset successfully',
    };
  }
}
