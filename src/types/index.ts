export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  cached?: boolean;
}

export interface CacheStats {
  totalAnalyses: number;
  averageAccessCount: number;
}
