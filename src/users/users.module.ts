import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Password } from '../config/password/password';
import { Token } from '../config/token/token';
import { User, UsersSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthService } from 'src/config/auth/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET_KEY'),
                signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
            }),
        })
    ],
    providers: [UsersService, UsersRepository, Token, Password, AuthService],
    controllers: [UsersController],
    exports: [UsersRepository, MongooseModule]
})
export class UsersModule {}
