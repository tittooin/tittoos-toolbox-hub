import { LogEntry } from '../../../../src/types/ai';

export class Logger {
  static info(entry: LogEntry) {
    console.log(JSON.stringify({ level: 'INFO', ...entry }));
  }

  static error(entry: LogEntry) {
    console.error(JSON.stringify({ level: 'ERROR', ...entry }));
  }

  static warn(entry: LogEntry) {
    console.warn(JSON.stringify({ level: 'WARN', ...entry }));
  }

  static debug(entry: LogEntry) {
    // Only log debug in local/development environments
    console.debug(JSON.stringify({ level: 'DEBUG', ...entry }));
  }
}
