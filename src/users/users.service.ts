import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { LoginUserDTO } from './dto/login-user-dto';
import { Token } from 'src/config/token/token';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {

    constructor(
        private readonly repository: UsersRepository,
        private readonly token: Token
    ) { }

    public async findAll(): Promise<User[]> {
        return this.repository.findAll();
    }

    public async findById(id: string): Promise<User> {
        return this.find(id);        
    }

    public async create(user: CreateUserDto): Promise<void> {
        this.repository.create(user);       
    }

    public async update(id: string, user: UpdateUserDto): Promise<void> {

        await this.find(id);
        
        this.repository.update(id, user);
    }

    public async delete(id: string): Promise<void> {

        await this.find(id);

        this.repository.delete(id);
    }

    public async login(user: LoginUserDTO): Promise<String> {

        const foundUser: User | null = await this.repository.findByUsername(user.username);

        if (!foundUser) {
            throw new NotFoundException(`User ${user.username} not found.`);
        }

        if (foundUser.password !== user.password) {
            throw new UnauthorizedException();
        }

        return this.token.generate(foundUser);
    }

    private async find(id: string): Promise<User> {

        const foundUser: User | null = await this.repository.findById(id);

        if (!foundUser) {
            throw new NotFoundException(`User ${id} not found.`);
        }

        return foundUser;
    }

}