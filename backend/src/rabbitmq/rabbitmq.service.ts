import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ChannelModel, Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {

  private conn: ChannelModel; 
  private channel: Channel;
  readonly XRAY_QUEUE = 'xray_queue';

  async onModuleInit() {

    const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
    this.conn = await amqp.connect(url); // returns ChannelModel 
    this.channel = await this.conn.createChannel(); // returns Channel
    await this.channel.assertQueue(this.XRAY_QUEUE, { durable: true });
    console.log('Connected to RabbitMQ and asserted queue', this.XRAY_QUEUE);
  }

  async publish(queue: string, msg: object) {
    
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  }

  async consume(queue: string, onMessage: (msg: ConsumeMessage) => void) {
    
    await this.channel.consume(
      queue,
      (m) => {
        if (m) onMessage(m);
      },
      { noAck: false },
    );
  }

  ack(message: ConsumeMessage) {
    this.channel.ack(message);
  }

  nack(message: ConsumeMessage, requeue = false) {
    this.channel.nack(message, false, requeue);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.conn?.close();
  }
}
