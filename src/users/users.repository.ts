import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class UsersRepository {

    constructor(@InjectModel(User.name) private readonly model: Model<User>) { }

    public async findAll(): Promise<User[]> {
        return this.model.find().select('-password');
    }

    public async findById(id: string): Promise<User | null> {
        return this.model.findById(id).select('-password');
    }

    public async findByUsername(username: string): Promise<User | null> {
        return this.model.findOne({ username });
    }

    public async create(user: CreateUserDto): Promise<void> {
        this.model.create(user);
    }

    public async update(id: string, user: UpdateUserDto): Promise<void> {
        await this.model.findByIdAndUpdate(id, user);
    }

    public async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

}