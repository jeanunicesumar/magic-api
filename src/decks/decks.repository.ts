import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';


@Injectable()
export class DecksRepository {

    constructor(@InjectModel(Deck.name) private readonly model: Model<Deck>) { }

    // TODO: Nos cards repository(Criado com tarefa de popular)
    // Criar método para buscar commander
    // Criar método para buscar cartas já trazer 99 corretas filtrando terreno e cores

    public async findAll(): Promise<Deck[]> {
        return this.model.find();
    }

    public async findById(id: string): Promise<Deck | null> {
        return this.model.findById(id);
    }

    public async create(deck: CreateDeckDto): Promise<Deck> {
        return this.model.create(deck);
    }

    public async update(id: string, deck: UpdateDeckDto): Promise<void> {
        await this.model.findByIdAndUpdate(id, deck);
    }

    public async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id);
    }

    public async createAll(decks: Array<Deck>) {
        this.model.create(decks);
    }

}