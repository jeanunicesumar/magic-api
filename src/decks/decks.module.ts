import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DecksSchema } from './entities/deck.entity';
import { DecksRepository } from './decks.repository';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { MagicRequest } from 'src/utils/request/magic.request';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DecksSchema }]),
],
providers: [DecksService, DecksRepository, DecksFactory, MagicRequest],
controllers: [DecksController],
})
export class DecksModule {}
