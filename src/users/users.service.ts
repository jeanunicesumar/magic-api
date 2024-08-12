import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user';
import { UsersRepository } from './users.repository';
import { LoginUserDTO } from './dto/loginUserDto';
import { Token } from 'src/config/token/token';
import { CreateUserDto } from './dto/createUserDto';


@Injectable()
export class UsersService {

    constructor(
        private readonly repository: UsersRepository,
        private readonly token: Token
    ) { }

    async create(user: CreateUserDto): Promise<void> {
        this.repository.create(user);       
    }

    async login(user: LoginUserDTO): Promise<String> {

        const foundUser: User | null = await this.repository.findByUsername(user.username);

        if (!foundUser) {
            throw new UnauthorizedException();
        }

        if (foundUser.password !== user.password) {
            throw new UnauthorizedException();
        }

        return this.token.generate(foundUser);

    }

    async findAll(): Promise<User[]> {
        return this.repository.findAll();
    }
}