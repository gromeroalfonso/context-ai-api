import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'contextai_user',
    password: process.env.DATABASE_PASSWORD || 'dev_password',
    database: process.env.DATABASE_NAME || 'contextai',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development', // ⚠️ Solo en desarrollo
    logging: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
  }),
);
