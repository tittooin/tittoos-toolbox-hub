export interface IResponseFormatter {
  formatEvent<T>(eventType: string, payload: T): string;
}
