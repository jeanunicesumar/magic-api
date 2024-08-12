import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

const mongooseConfig = (configService: ConfigService) => ({
  uri: configService.get<string>('DATABASE'),
});

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mongooseConfig,
    }),
  ],
})
export class AppModule {}