import { Injectable } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';
import { DecksRepository } from './decks.repository';
import { MagicRequest } from 'src/utils/request/magic.request';
import { Card } from './entities/card.entity';
import { DecksFactory } from 'src/utils/factories/decks-factory';

@Injectable()
export class DecksService {

  constructor(
    private readonly repository: DecksRepository,
    private readonly factory: DecksFactory
  ) {}

  public async generate(): Promise<Deck> {
    return await this.factory.build();
  }

  public async create(createDeckDto: CreateDeckDto): Promise<void> {
    return this.repository.create(createDeckDto);
  }

  public async findAll(): Promise<Deck[]> {
    return this.repository.findAll();
  }

  public async findOne(id: string): Promise<Deck> {
    return this.repository.findById(id);
  }

  public async update(id: string, deck: UpdateDeckDto): Promise<void> {
    return this.repository.update(id, deck);
  }

  public async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

}
