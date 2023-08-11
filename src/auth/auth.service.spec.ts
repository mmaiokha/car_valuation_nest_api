import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {Repository} from "typeorm";
import {User} from "../users/users.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {IAuthResponse} from "./interfaces/auth-response.interface";
import {ConfigModule} from "@nestjs/config";

require('dotenv').config()


describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule, ConfigModule.forRoot({isGlobal: true})],
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


})

