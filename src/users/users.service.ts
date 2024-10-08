import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Password } from '../config/password/password';
import { Token } from '../config/token/token';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';


@Injectable()
export class UsersService {

    constructor(
        private readonly repository: UsersRepository,
        private readonly token: Token,
        private readonly password: Password
    ) { }

    public async findAll(): Promise<User[]> {
        return this.repository.findAll();
    }

    public async findOne(id: string): Promise<User> {
        return this.find(id);        
    }

    public async create(user: CreateUserDto): Promise<void> {

        user.password = await this.password.encrypt(user.password);
        
        this.repository.create(user);       
    }

    public async update(id: string, user: UpdateUserDto): Promise<void> {

        if (user.password) {
            user.password = await this.password.encrypt(user.password);
        }
        
        await this.find(id);
        
        this.repository.update(id, user);
    }

    public async delete(id: string): Promise<void> {

        await this.find(id);

        this.repository.delete(id);
    }

    public async login(user: LoginUserDTO): Promise<String> {

        const foundUser: User | null = await this.repository.findByUsername(user.username);

        this.validateFound(foundUser, user.username);

        if (this.isInvalidPassword(user.password, foundUser.password)) {
            throw new UnauthorizedException();
        }

        return this.token.generate(foundUser);
    }

    private async find(id: string): Promise<User> {

        const foundUser: User | null = await this.repository.findById(id);

       this.validateFound(foundUser, id);

        return foundUser;
    }

    private isInvalidPassword(password: string, hashPassword: string): boolean {
        return !this.password.compare(password, hashPassword);
    }

    private validateFound(user: User, fieldMessage: string): void {
        if (!user) {
            throw new NotFoundException(`User ${fieldMessage} not found.`);
        }
    }

}