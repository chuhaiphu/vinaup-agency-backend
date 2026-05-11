import { Inject, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import authConfig from 'src/_core/configs/auth.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocalSignInRequestDto } from 'src/auth/dtos/local-signin.request.dto';
import { AuthResponseDto } from 'src/auth/dtos/auth.response.dto';
import { InvalidCredentialsException } from 'src/_common/exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>
  ) { }

  async localSignIn(dto: LocalSignInRequestDto): Promise<AuthResponseDto> {

    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = compareSync(dto.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: this.authConf.jwt.secret,
        expiresIn: this.authConf.jwt.expiresIn / 1000,
      }
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }


  async resetPassword(userId: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If user is supadmin, use supadmin password; otherwise use default password
    let resetPassword: string;
    if (user.role === 'supadmin') {
      resetPassword = this.authConf.defaultValue.supAdminPassword;
    } else {
      resetPassword = this.authConf.defaultValue.defaultPassword!;
    }

    const hashedPassword = hashSync(resetPassword, 10);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async resetPasswordForUser(currentUserId: string, targetUserId: string): Promise<void> {
    // Get current user to check role
    const currentUser = await this.prismaService.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      throw new UnauthorizedException('Current user not found');
    }

    // Only supadmin can reset other user's password
    if (currentUser.role !== 'supadmin') {
      throw new BadRequestException('Only supadmin can reset other user\'s password');
    }
    const targetUser = await this.prismaService.user.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser) {
      throw new BadRequestException('Target user not found');
    }

    const hashedPassword = hashSync(this.authConf.defaultValue.defaultPassword || '', 10);

    await this.prismaService.user.update({
      where: { id: targetUserId },
      data: { password: hashedPassword },
    });
  }
}
