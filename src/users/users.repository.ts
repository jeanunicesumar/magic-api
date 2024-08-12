import { Injectable } from '@nestjs/common';
import { User } from './user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUserDto';


@Injectable()
export class UsersRepository {

    constructor(@InjectModel(User.name) private readonly model: Model<User>) { }

    async create(user: CreateUserDto): Promise<void> {
        this.model.create(user);
    }

    async find(): Promise<void> {

    }

    async findByUsername(username: string): Promise<User | null> {
        return this.model.findOne({ username });
    }

    async findAll(): Promise<User[]> {
        return this.model.find();
    }
}