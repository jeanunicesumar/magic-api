import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RedisService } from 'src/config/redis/redis.service';
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
    private readonly user: UsersRepository,
    private readonly redis: RedisService,
    @Inject('Notifications_service') private readonly notificationsClient: ClientProxy
  ) {}

  public async generate(userId: string): Promise<Deck> {

    const deck: Deck = await this.factory.build();
    this.create(deck, userId);
    this.notificationsClient.emit('deck_generated', {userId, deck})
    return deck;
  }

  public async generateJson(): Promise<string> {
    const deck: Deck = await this.factory.build();
    
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
    this.notificationsClient.emit('deck_updated', { id, deck });
    return this.repository.update(id, deck);
  }

  public async remove(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  public async populate(): Promise<void> {
    this.cardFactory.populate();
  }

  public async validateJson(file: Express.Multer.File): Promise<string> {

    const deckToValidation: ValidateDeckDTO = await this.validateFile(file);
    this.callValidationDeck(deckToValidation);

    return "Deck válido";
  }

  public async importJson(file: Express.Multer.File): Promise<string> {

    const deckToValidation: ValidateDeckDTO = await this.validateFile(file);
    this.callValidationDeck(deckToValidation);

    const deck: Deck = await this.repository.create(deckToValidation);
    this.notificationsClient.emit('deck_generated', deck);

    return "Deck importado";
  }

  private callValidationDeck(deck: ValidateDeckDTO) {
    new ValidationDeck().handle(deck);
  }

  private async validateFile(file: Express.Multer.File): Promise<ValidateDeckDTO> {
       
    const data = file.buffer.toString('utf8');
    const deck: ValidateDeckDTO = JSON.parse(data.toString());

    const deckToValidation = plainToInstance(ValidateDeckDTO, deck);
    const errors = await validate(deckToValidation);

    if (errors.length !== 0) {
      throw new NotAcceptableException(errors);
    }
    
    return deckToValidation;

  }

}