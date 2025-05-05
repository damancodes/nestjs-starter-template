import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { HashPasswordPipe } from './pipes/hash-password.pipe';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './user.decorator';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { IDecodedToken } from './auth.types';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { User as IUser } from 'src/users/entities/user.entity';
import { GoogleOAuthGuard } from './guards/google-auth.guard';
import { CookieService } from 'src/common/services/cookie.service';
@ApiTags('Auth') // Optional: tags the controller in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('register')
  @UsePipes(HashPasswordPipe)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User registered successfully',
      data: user,
    };
  }

  //use login for user password proivder
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginAuthDTO })
  login(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    const token = this.authService.login(user);
    this.cookieService.setCookie(response, 'access_token', token.access_token);
    return token;
  }

  @Get('login/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.authService.login(user);
    this.cookieService.setCookie(response, 'access_token', token.access_token);
    return token;
    // return this.appService.googleLogin(req);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getprofile(@User() user: IDecodedToken) {
    return user;
  }
}
