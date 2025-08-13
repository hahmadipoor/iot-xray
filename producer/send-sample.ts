// producer/send-sample.ts
//import * as amqp from 'amqplib';
import * as fs from 'fs';
import * as path from 'path';
import amqp from "amqplib"

const XRAY_QUEUE = 'xray_queue';
const RABBIT = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

// sample payload 
const sampleFilePath = path.join(__dirname, 'sample.json');
const sample = JSON.parse(fs.readFileSync(sampleFilePath, 'utf-8'));

async function run() {
  const conn = await amqp.connect(RABBIT);
  const ch = await conn.createChannel();
  await ch.assertQueue(XRAY_QUEUE, { durable: true });
  ch.sendToQueue(XRAY_QUEUE, Buffer.from(JSON.stringify(sample)), { persistent: true });
  console.log('Sent sample payload to', XRAY_QUEUE);
  await ch.close();
  await conn.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
