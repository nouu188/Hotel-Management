// lib/queue.ts
import { Queue, type ConnectionOptions } from 'bullmq';

const connectionString = process.env.REDIS_URL;
if (!connectionString) {
  throw new Error("REDIS_URL environment variable is not set.");
}

export const getRedisConnectionOptions = (): ConnectionOptions => ({
  url: connectionString,
  maxRetriesPerRequest: null,
});

export const BOOKING_EXPIRATION_QUEUE_NAME = 'booking-expiration';

let bookingQueue: Queue | undefined;
export const getBookingExpirationQueue = () => {
  if (!bookingQueue) {
    bookingQueue = new Queue(BOOKING_EXPIRATION_QUEUE_NAME, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    });
  }
  return bookingQueue;
};

export async function removeBookingExpirationJob(bookingId: string) {
  const queue = getBookingExpirationQueue();
  const job = await queue.getJob(bookingId);
  if (job) {
    await job.remove();
  }
}