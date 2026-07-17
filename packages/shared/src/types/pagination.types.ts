export interface PaginationParams {
  cursor?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}
