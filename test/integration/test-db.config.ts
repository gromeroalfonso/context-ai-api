import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { KnowledgeSourceModel } from '../../src/modules/knowledge/infrastructure/persistence/models/knowledge-source.model';
import { FragmentModel } from '../../src/modules/knowledge/infrastructure/persistence/models/fragment.model';

// Test database configuration constants
const TEST_DB_PORT = 5432;
const TEST_DB_POOL_SIZE = 5;

/**
 * Test Database Configuration
 *
 * Provides TypeORM configuration for integration tests.
 * Uses the same PostgreSQL container but with a separate test database.
 *
 * Note: Tests should clean up after themselves to avoid test pollution.
 */
export const testDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || String(TEST_DB_PORT), 10),
  username: process.env.TEST_DB_USERNAME || 'context_ai_user',
  password: process.env.TEST_DB_PASSWORD || 'context_ai_pass',
  database: process.env.TEST_DB_DATABASE || 'context_ai_test',

  // Entities
  entities: [KnowledgeSourceModel, FragmentModel],

  // Synchronize schema for tests (recreate on each run)
  synchronize: true,
  dropSchema: true, // Drop and recreate schema on each test run

  // Logging
  logging: process.env.TEST_DB_LOGGING === 'true',

  // Connection pool
  poolSize: TEST_DB_POOL_SIZE,

  // Auto-load entities
  autoLoadEntities: true,
};

