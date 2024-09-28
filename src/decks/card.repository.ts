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

    public async findCommanderRandom(): Promise<Card> {
        const result = await this.model.aggregate([
            { $match: { isCommander: true } },
            { $sample: { size: 1 } }
        ]);
    
        return result[0] as Card;
    }

    public async findByColorIdentity(colors: string[]): Promise<Card[]> {
        const regex = colors.map(color => new RegExp(color));
    
        return await this.model.find({
            colorIdentity: { $in: regex }
        }).limit(99) as Card[];
    }

}