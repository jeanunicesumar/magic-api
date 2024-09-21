import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from 'src/config/redis/redis.service';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { MagicRequest } from 'src/utils/request/magic.request';
import CardAdapter from './adapter/card.adapter';
import { CardRepository } from './card.repository';
import { DecksController } from './decks.controller';
import { DecksRepository } from './decks.repository';
import { DecksService } from './decks.service';
import { Card, CardsSchema } from './entities/card.entity';
import { Deck, DecksSchema } from './entities/deck.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/config/auth/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DecksSchema }, { name: Card.name, schema: CardsSchema }]),
    UsersModule
  ],
  providers: [DecksService, DecksRepository, DecksFactory, MagicRequest, CardAdapter, RedisService, CardRepository, UsersRepository, AuthService],
  controllers: [DecksController],
})
export class DecksModule {}
