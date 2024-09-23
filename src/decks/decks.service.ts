import { Injectable, NotAcceptableException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UsersRepository } from 'src/users/users.repository';
import { CardFactory } from 'src/utils/factories/card-factory';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { Json } from 'src/utils/json/json';
import { DecksRepository } from './decks.repository';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { ValidateDeckDTO } from './dto/validate-deck.dto';
import { Deck } from './entities/deck.entity';
import { ValidationDeck } from './validation/validation-deck';

@Injectable()
export class DecksService {

  constructor(
    private readonly repository: DecksRepository,
    private readonly factory: DecksFactory,
    private readonly cardFactory: CardFactory,
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

  public async validateJson(file: Express.Multer.File): Promise<string> {

    const data = file.buffer.toString('utf8');
    const deck: ValidateDeckDTO = JSON.parse(data.toString());

    const deckToValidation = plainToInstance(ValidateDeckDTO, deck);
    const errors = await validate(deckToValidation);

    if (errors.length !== 0) {
      throw new NotAcceptableException(errors);
    }

    this.callValidationDeck(deckToValidation);

    return "Deck válido";
  }

  private callValidationDeck(deck: ValidateDeckDTO) {
    new ValidationDeck().handle(deck);
  }

  private convertCacheToBoolean(cache: string): boolean {
    
    if ('false' === cache?.toLowerCase()) {
      return false;
    }

    return true;

  }

}
