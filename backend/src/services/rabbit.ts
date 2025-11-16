import amqplib from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

type AmqpConnection = Awaited<ReturnType<typeof amqplib.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection['createChannel']>>;

let connection: AmqpConnection | null = null;
let channel: AmqpChannel | null = null;

const RABBIT_URL = process.env.RABBIT_URL || 'amqp://rabbitmq:5672';
const QUEUE = 'crawl_requests';

export async function connectRabbit() {
  if (connection && channel) {
    return { connection, channel };
  }

  connection = await amqplib.connect(RABBIT_URL);
  channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log('[rabbit] connected and queue ready:', QUEUE);

  return { connection, channel };
}

export async function publishCrawlRequest(productId: string) {
  if (!channel) {
    throw new Error('RabbitMQ is not connected');
  }

  const msg = JSON.stringify({ productId, ts: Date.now() });

  channel.sendToQueue(QUEUE, Buffer.from(msg), {
    persistent: true,
  });
}
