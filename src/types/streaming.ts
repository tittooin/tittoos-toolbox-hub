export type StreamingEventType = 
  | 'INIT'
  | 'RESOLUTION'
  | 'PRODUCTS'
  | 'MERCHANTS'
  | 'COMPARISON'
  | 'RECOMMENDATION'
  | 'AI_TEXT'
  | 'FOLLOWUPS'
  | 'WARNING'
  | 'ERROR'
  | 'DONE';

export interface StreamingEvent<T = unknown> {
  event: StreamingEventType;
  data: T;
  timestamp: string;
}

export interface StreamingErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}
