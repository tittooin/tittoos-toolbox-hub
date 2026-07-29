import { IResponseFormatter } from './IResponseFormatter';
import { StreamingEvent, StreamingEventType } from '../../../../../src/types/streaming';

export class AIResponseFormatter implements IResponseFormatter {
  public formatEvent<T>(eventType: StreamingEventType, payload: T): string {
    const event: StreamingEvent<T> = {
      event: eventType,
      data: payload,
      timestamp: new Date().toISOString()
    };
    return `data: ${JSON.stringify(event)}\n\n`;
  }
}
