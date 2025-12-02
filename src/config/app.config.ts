import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    appName: process.env.APP_NAME || 'Double-Entry Accounting System',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    corsCredentials: process.env.CORS_CREDENTIALS === 'true',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadDestination: process.env.UPLOAD_DESTINATION || './uploads',
    logLevel: process.env.LOG_LEVEL || 'debug',
    logFilePath: process.env.LOG_FILE_PATH || './logs',
}));
