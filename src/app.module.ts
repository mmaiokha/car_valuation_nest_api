import {Module, ValidationPipe} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import ormConfig from "./config/orm/orm.config";
import {APP_PIPE} from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        TypeOrmModule.forRootAsync({
            useFactory: ormConfig
        }),
        AuthModule,
        UsersModule,
        ReportsModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe()
        }
    ],
})
export class AppModule {
}
