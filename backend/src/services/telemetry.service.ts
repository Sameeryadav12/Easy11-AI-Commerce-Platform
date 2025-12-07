import { Kafka, Producer, logLevel } from 'kafkajs';
import { TelemetryPayload } from '../types/telemetry';
import { logger } from '../utils/logger';

const topic = process.env.TELEMETRY_TOPIC || 'events_ops';
const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

let producer: Producer | null = null;
let isConnecting = false;

async function getProducer() {
  if (producer) {
    return producer;
  }

  if (isConnecting) {
    // Wait briefly for the ongoing connection attempt
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (producer) {
      return producer;
    }
  }

  isConnecting = true;

  try {
    const kafka = new Kafka({
      clientId: 'easy11-telemetry-producer',
      brokers,
      logLevel: logLevel.ERROR,
    });

    producer = kafka.producer({
      allowAutoTopicCreation: true,
    });

    await producer.connect();
    logger.info(`[telemetry] Connected to Kafka brokers: ${brokers.join(', ')}`);
  } catch (error) {
    logger.error('[telemetry] Failed to connect to Kafka', error);
    producer = null;
  } finally {
    isConnecting = false;
  }

  return producer;
}

export async function publishTelemetryEvent(payload: TelemetryPayload) {
  logger.debug('[telemetry] Received payload', payload);

  // Always write to local logfile for redundancy
  logger.info('[telemetry:event]', payload);

  try {
    const kafkaProducer = await getProducer();

    if (!kafkaProducer) {
      return { queued: false, reason: 'kafka_unavailable' };
    }

    await kafkaProducer.send({
      topic,
      messages: [
        {
          key: payload.serviceName,
          value: JSON.stringify(payload),
        },
      ],
    });

    return { queued: true };
  } catch (error) {
    logger.error('[telemetry] Failed to publish event', error);
    return { queued: false, reason: 'publish_error' };
  }
}


