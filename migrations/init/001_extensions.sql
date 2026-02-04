-- Enable required PostgreSQL extensions

-- UUID generation v7 (time-ordered)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Trigram text search (for full-text search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Comentario informativo
COMMENT ON EXTENSION vector IS 'Vector similarity search for embeddings';
COMMENT ON EXTENSION pg_trgm IS 'Trigram matching for text search';


