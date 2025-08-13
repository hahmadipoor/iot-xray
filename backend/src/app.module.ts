// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { SignalsModule } from './signals/signals.module';
import { MongooseModule } from '@nestjs/mongoose';

// backend/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/iot-xray'),
      }),
    }),
    RabbitmqModule,
    SignalsModule,
  ],
})
export class AppModule {}

