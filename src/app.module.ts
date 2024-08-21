import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './config/redis/redis.module';
import { DecksModule } from './decks/decks.module';
import { UsersModule } from './users/users.module';

const mongooseConfig = (configService: ConfigService) => ({
  uri: configService.get<string>('DATABASE'),
});

@Module({
  imports: [
    RedisModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mongooseConfig,
    }),
    DecksModule,
  ],
})
export class AppModule {}