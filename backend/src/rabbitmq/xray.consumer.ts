import { Injectable, Logger } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { SignalsService } from '../signals/signals.service';
import * as amqp from 'amqplib';

@Injectable()
export class XrayConsumer {

  private readonly logger = new Logger(XrayConsumer.name);

  constructor(
    private readonly rabbit: RabbitmqService,
    private readonly signalsService: SignalsService,
  ) {
    this.init();
  }

  async init() {

    // wait a tick for Rabbit to be ready (onModuleInit) - simple approach
    setTimeout(() => this.startConsuming(), 500);
  }

  async startConsuming() {
    await this.rabbit.consume(this.rabbit.XRAY_QUEUE, 
      async (msg: amqp.ConsumeMessage) => {
        try {
          const raw = msg.content.toString();
          const payload = JSON.parse(raw); 
          // process payload
          await this.handleXrayMessage(payload);
          this.rabbit.ack(msg);
        } catch (err) {
          this.logger.error('Failed to process message', err as any);
          // nack with requeue false to avoid infinite loops; adjust per your policy
          this.rabbit.nack(msg, false);
        }
    });
    this.logger.log('Started consuming xray_queue');
  }

  private async handleXrayMessage(payload: any) {

    // payload may be object keyed by deviceId like sample; support different shapes
    // { "deviceId": { data: [[time,[x,y,speed]], ...], time: timestamp } }
    // We'll iterate keys:
    for (const deviceId of Object.keys(payload)) {
      const deviceObj = payload[deviceId];
      // parse items
      const data = deviceObj.data ?? [];
      const timestamp = deviceObj.time ?? Date.now();
      const dataLength = data.length;
      const dataVolume = Buffer.byteLength(JSON.stringify(deviceObj), 'utf8');

      // We can extract more parameters; for the demo I just extracted first and last coords
      const first = data[0]?.[1] ?? null;
      const last = data[data.length - 1]?.[1] ?? null;

      await this.signalsService.create({
        deviceId,
        time: new Date(timestamp),
        dataLength,
        dataVolume,
        raw: deviceObj,
        firstPoint: first,
        lastPoint: last,
      });
    }
  }
}
