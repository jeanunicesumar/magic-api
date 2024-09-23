import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { CardFactory } from 'src/utils/factories/card-factory';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { Json } from 'src/utils/json/json';
import { DecksRepository } from './decks.repository';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class DecksService {

  constructor(
    private readonly repository: DecksRepository,
    private readonly factory: DecksFactory,
    private readonly cardFactory: CardFactory,
    private readonly user: UsersRepository,
    private readonly redis: RedisService
  ) {}

  public async generate(cache: string, userId: string): Promise<Deck> {
    const deck: Deck = await this.factory.build(this.convertCacheToBoolean(cache));
    this.create(deck, userId);

    return deck;
  }

  public async generateJson(cache: string): Promise<string> {
    const deck: Deck = await this.factory.build(this.convertCacheToBoolean(cache));
    
    return Json.toJson(deck);
  }

  public async create(createDeckDto: CreateDeckDto, userId: string): Promise<void> {
    const deck: Deck = await this.repository.create(createDeckDto); 
    const user = await this.user.findById(userId);
    if (user) {
      user.decks.push(deck);
      await this.user.create(user);  
    }
  }

  public async findAll(page: number): Promise<Deck[]> {
    const limit = 2;
    const offset = (page - 1) * limit;
     return this.repository.findAll(offset, limit);
  }

  public async listDecks(userId: string): Promise<Deck[]> {
    const key = `user:${userId}:decks`;
    const cachedDecks = await this.redis.getValue(key);

    if (cachedDecks) {
      return JSON.parse(cachedDecks) as Deck[];
    }   
    const user = await this.user.findById(userId);
    await this.redis.setValue(key, JSON.stringify(user.decks));
    return user.decks;
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

  public async populate(): Promise<void> {
    this.cardFactory.populate();
  }

  private convertCacheToBoolean(cache: string): boolean {
    
    if ('false' === cache?.toLowerCase()) {
      return false;
    }

    return true;

  }

}
