import { Body, Controller, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {

    constructor(private readonly service: UsersService) { }

    @Get()
    public async findAll(): Promise<User[]> {
        return this.service.findAll();
    }

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<User> {
        return await this.service.findOne(id);
    }

    @Post()
    public async create(@Body() user: CreateUserDto): Promise<void> {
        return this.service.create(user);
    }

    @Patch(':id')
    public async update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<void> {
        return this.service.update(id, user);
    }

    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<void> {
        return this.service.delete(id);
    }

    @Post('/login')
    public async login(@Body() user: LoginUserDTO): Promise<String> {
        return this.service.login(user);
    }
    
}