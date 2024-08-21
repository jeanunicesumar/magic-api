import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from 'src/config/redis/redis.service';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { MagicRequest } from 'src/utils/request/magic.request';
import CardAdapter from './adapter/card.adapter';
import { DecksController } from './decks.controller';
import { DecksRepository } from './decks.repository';
import { DecksService } from './decks.service';
import { Deck, DecksSchema } from './entities/deck.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DecksSchema }]),
  ],
  providers: [DecksService, DecksRepository, DecksFactory, MagicRequest, CardAdapter, RedisService],
  controllers: [DecksController],
})
export class DecksModule {}
