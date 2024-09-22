import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from './entities/card.entity';


@Injectable()
export class CardRepository {

    constructor(@InjectModel(Card.name) private readonly model: Model<Card>) { }

    public async findAll(): Promise<Card[]> {
        return this.model.find();
    }

    public async findById(id: string): Promise<Card | null> {
        return this.model.findById(id);
    }

    public async createAll(cards: Array<Card>) {
        await this.model.insertMany(cards);
    }

    public async create(cards: Card) {
        await this.model.create(cards);
    }

}