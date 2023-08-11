import {Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dtos/register.dto";
import {IAuthResponse} from "./interfaces/auth-response.interface";
import {CurrentUser} from "./decorators/current-user.decorator";
import {User} from "../users/users.entity";
import {LocalGuard} from "./guards/local.guard";
import {JwtAccessGuard} from "./guards/jwt-access.guard";
import {Serialize} from "../interceptors/serialize.interceptor";
import {UserCleanDto} from "../users/dtos/user-clean.dto";

// @Serialize(UserCleanDto)
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Post("register")
    async register(@Body() registerDto: RegisterDto): Promise<IAuthResponse> {
        return await this.authService.register(registerDto);
    }


    @UseGuards(LocalGuard)
    @Post("login")
    async login(@CurrentUser() user: User): Promise<IAuthResponse> {
        return await this.authService.login(user);
    }

    @UseGuards(JwtAccessGuard)
    @Get("me")
    async me(@CurrentUser() user: User): Promise<User> {
        return user
    }
}
