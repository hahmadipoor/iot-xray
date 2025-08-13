import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { SignalsModule } from '../signals/signals.module';
import { XrayConsumer } from './xray.consumer';


@Module({
  imports: [SignalsModule],
  providers: [RabbitmqService, XrayConsumer],
  controllers: [RabbitmqController]
})
export class RabbitmqModule {}
