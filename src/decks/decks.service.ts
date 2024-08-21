import { Injectable } from '@nestjs/common';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { Json } from 'src/utils/json/json';
import { DecksRepository } from './decks.repository';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';

@Injectable()
export class DecksService {

  constructor(
    private readonly repository: DecksRepository,
    private readonly factory: DecksFactory
  ) {}

  public async generate(cache: string): Promise<Deck> {
    return await this.factory.build(this.convertCacheToBoolean(cache));
  }

  public async generateJson(cache: string): Promise<string> {
    const deck: Deck = await this.factory.build(this.convertCacheToBoolean(cache));
    return Json.toJson(deck);
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

  private convertCacheToBoolean(cache: string): boolean {
    
    if ('false' === cache?.toLowerCase()) {
      return false;
    }

    return true;

  }

}
