import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from 'src/config/redis/redis.service';
import { UsersRepository } from 'src/users/users.repository';
import { CardFactory } from 'src/utils/factories/card-factory';
import { DecksFactory } from 'src/utils/factories/decks-factory';
import { MagicRequest } from 'src/utils/request/magic.request';
import CardAdapter from './adapter/card.adapter';
import { CardRepository } from './card.repository';
import { DecksController } from './decks.controller';
import { DecksRepository } from './decks.repository';
import { DecksService } from './decks.service';
import { Card, CardsSchema } from './entities/card.entity';
import { Deck, DecksSchema } from './entities/deck.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/config/auth/auth.service';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationsModule } from 'src/notifications/notification.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DecksSchema }, { name: Card.name, schema: CardsSchema }]),
    UsersModule,
    NotificationsModule,
    ClientsModule.registerAsync([
      {
        name: 'Notifications_service',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get<string>('RABBITMQ_URL')}:${configService.get<string>('RABBITMQ_PORT')}`],
            queue: configService.get<string>('RABBITMQ_QUEUE'),
            queueOptions: {
              durable: false
            },
          },
        }),
      },
    ]),
  ],
  providers: [DecksService, DecksRepository, DecksFactory, MagicRequest, CardAdapter, RedisService, CardRepository, UsersRepository, CardFactory, AuthService, NotificationService],
  controllers: [DecksController],
})
export class DecksModule {}
