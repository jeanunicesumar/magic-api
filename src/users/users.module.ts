import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { Token } from 'src/config/token/token';
import { User, UsersSchema } from './entities/user.entity';
import { Password } from 'src/config/password/password';

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
    providers: [UsersService, UsersRepository, Token, Password],
    controllers: [UsersController],
})
export class UsersModule {}
