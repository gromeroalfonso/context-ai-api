/**
 * Fragment Entity
 *
 * Represents a chunk of content from a knowledge source with its vector embedding.
 * Fragments are the basic unit of retrieval in the RAG system.
 *
 * Key Responsibilities:
 * - Store content chunks from documents
 * - Maintain vector embeddings for semantic search
 * - Track position within the source document
 * - Support metadata for additional context
 */
export class Fragment {
  public id?: string;
  public sourceId: string;
  public content: string;
  public position: number;
  public embedding: number[];
  public metadata?: Record<string, any>;
  public createdAt: Date;

  // Supported embedding dimensions
  private static readonly VALID_DIMENSIONS = [768, 1536];
  private static readonly GEMINI_DIMENSION = 768; // Gemini text-embedding-004
  private static readonly OPENAI_DIMENSION = 1536; // OpenAI text-embedding-3-small

  constructor(data: {
    sourceId: string;
    content: string;
    position: number;
    embedding: number[];
    metadata?: Record<string, any>;
  }) {
    this.validate(data);

    this.sourceId = data.sourceId;
    this.content = data.content;
    this.position = data.position;
    this.embedding = data.embedding;
    this.metadata = data.metadata;
    this.createdAt = new Date();
  }

  /**
   * Validates the fragment data
   */
  private validate(data: {
    sourceId: string;
    content: string;
    position: number;
    embedding: number[];
  }): void {
    // Source ID validation
    if (!data.sourceId || data.sourceId.trim() === '') {
      throw new Error('SourceId cannot be empty');
    }

    // Content validation
    if (!data.content || data.content.trim() === '') {
      throw new Error('Content cannot be empty');
    }

    if (data.content.length < 10) {
      throw new Error('Content must be at least 10 characters long');
    }

    // Position validation
    if (data.position < 0) {
      throw new Error('Position cannot be negative');
    }

    // Embedding validation
    if (data.embedding == null) {
      throw new Error('Embedding cannot be null or undefined');
    }

    if (!Array.isArray(data.embedding)) {
      throw new Error('Embedding must be an array');
    }

    if (data.embedding.length === 0) {
      throw new Error('Embedding array cannot be empty');
    }

    this.validateEmbeddingDimension(data.embedding);
  }

  /**
   * Validates embedding dimension
   */
  private validateEmbeddingDimension(embedding: number[]): void {
    if (!Fragment.VALID_DIMENSIONS.includes(embedding.length)) {
      throw new Error(
        `Embedding must be ${Fragment.VALID_DIMENSIONS.join(' or ')} dimensions`,
      );
    }
  }

  // ==================== Content Analysis ====================

  /**
   * Returns the length of the content in characters
   */
  public getContentLength(): number {
    return this.content.length;
  }

  /**
   * Estimates the number of tokens in the content
   * Rough estimate: 1 token ≈ 4 characters
   */
  public estimateTokenCount(): number {
    return Math.ceil(this.content.length / 4);
  }

  /**
   * Checks if the content contains a specific term (case insensitive)
   * @param term - The term to search for
   */
  public containsTerm(term: string): boolean {
    return this.content.toLowerCase().includes(term.toLowerCase());
  }

  // ==================== Metadata Management ====================

  /**
   * Updates the metadata, merging with existing data
   * @param newMetadata - The new metadata to merge
   */
  public updateMetadata(newMetadata: Record<string, any>): void {
    this.metadata = {
      ...this.metadata,
      ...newMetadata,
    };
  }

  // ==================== Business Rules ====================

  /**
   * Checks if the fragment belongs to a specific source
   * @param sourceId - The source ID to check
   */
  public belongsToSource(sourceId: string): boolean {
    return this.sourceId === sourceId;
  }

  /**
   * Checks if this fragment comes before another fragment
   * @param other - The other fragment to compare with
   */
  public isBefore(other: Fragment): boolean {
    return this.position < other.position;
  }

  /**
   * Checks if this fragment comes after another fragment
   * @param other - The other fragment to compare with
   */
  public isAfter(other: Fragment): boolean {
    return this.position > other.position;
  }

  /**
   * Checks if this is the first fragment in the document
   */
  public isFirstFragment(): boolean {
    return this.position === 0;
  }

  // ==================== Embedding Operations ====================

  /**
   * Returns the dimension of the embedding vector
   */
  public getEmbeddingDimension(): number {
    return this.embedding.length;
  }

  /**
   * Updates the embedding vector (for reprocessing scenarios)
   * @param newEmbedding - The new embedding vector
   */
  public updateEmbedding(newEmbedding: number[]): void {
    this.validateEmbeddingDimension(newEmbedding);
    this.embedding = newEmbedding;
  }

  /**
   * Checks if this fragment uses Gemini embeddings
   */
  public usesGeminiEmbedding(): boolean {
    return this.embedding.length === Fragment.GEMINI_DIMENSION;
  }

  /**
   * Checks if this fragment uses OpenAI embeddings
   */
  public usesOpenAIEmbedding(): boolean {
    return this.embedding.length === Fragment.OPENAI_DIMENSION;
  }
}
