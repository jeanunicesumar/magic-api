import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user';
import { CreateUserDto } from './dto/createUserDto';
import { LoginUserDTO } from './dto/loginUserDto';

@Controller('users')
export class UsersController {

    constructor(private readonly service: UsersService) { }

    @Post('/sign-up')
    async create(@Body() user: CreateUserDto): Promise<void> {
        return this.service.create(user);
    }

    @Post('/sign-in')
    async login(@Body() user: LoginUserDTO): Promise<String> {
        return this.service.login(user);
    }

    @Get()
    async teste(): Promise<User[]> {
        return this.service.findAll();
    }
    
}