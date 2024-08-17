import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DecksModule } from './decks/decks.module';

const mongooseConfig = (configService: ConfigService) => ({
  uri: configService.get<string>('DATABASE'),
});

@Module({
  imports: [
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