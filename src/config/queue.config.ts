import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
    redis: {
        host: process.env.QUEUE_REDIS_HOST || 'localhost',
        port: parseInt(process.env.QUEUE_REDIS_PORT || '6379', 10),
        db: parseInt(process.env.QUEUE_REDIS_DB || '1', 10),
    },
}));
