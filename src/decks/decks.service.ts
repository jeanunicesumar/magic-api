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

@Injectable()
export class DecksService {

  constructor(
    private readonly repository: DecksRepository,
    private readonly factory: DecksFactory,
    private readonly magicRequest: MagicRequest,
    private readonly cardAdapter: CardAdapter,
    private readonly cardRepository: CardRepository,
  ) {}

  public async generate(cache: string): Promise<Deck> {
    const deck: Deck = await this.factory.build(this.convertCacheToBoolean(cache));
    this.repository.create(deck);

    return deck;
  }

  public async generateJson(cache: string): Promise<string> {
    const deck: Deck = await this.factory.build(this.convertCacheToBoolean(cache));
    this.repository.create(deck);
    
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
