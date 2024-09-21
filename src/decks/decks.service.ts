import { Injectable } from '@nestjs/common';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { Json } from 'src/utils/json/json';
import { MagicRequest } from 'src/utils/request/magic.request';
import CardAdapter from './adapter/card.adapter';
import { CardRepository } from './card.repository';
import { DecksRepository } from './decks.repository';
import { CreateDeckDto } from './dto/create-deck.dto';
import { ResponseCardDto } from './dto/response-card.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './entities/deck.entity';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class DecksService {

  constructor(
    private readonly repository: DecksRepository,
    private readonly factory: DecksFactory,
    private readonly magicRequest: MagicRequest,
    private readonly cardAdapter: CardAdapter,
    private readonly cardRepository: CardRepository,
    private readonly user: UsersRepository
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
    const deck = await this.repository.create(createDeckDto); 
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
    let count = 1;
    let urls: string[] = [];
    let batchSize = 10;
    let results = [];
    let hasMoreData = true;

    while (hasMoreData) {

        const url: string = this.magicRequest.getUrlSimple(count);
        urls.push(url);

        if (urls.length === batchSize) {
            const promises = urls.map(async (url) => {
                return (await this.fetchData(url)).cards.map(card => { 
                  const newCard = this.cardAdapter.createToEntity(card);
                  console.log(newCard);
                  return newCard;
              });
            });

            const batchResults = await Promise.all(promises);

            hasMoreData = false;

            results.push(...batchResults);
            urls = [];
        }

        count++;
    }

    this.cardRepository.createAll(results);
}

private async fetchData(url: string): Promise<ResponseCardDto> {
    return await fetch(url).then((response) => response.json());
}

  private convertCacheToBoolean(cache: string): boolean {
    
    if ('false' === cache?.toLowerCase()) {
      return false;
    }

    return true;

  }

}
