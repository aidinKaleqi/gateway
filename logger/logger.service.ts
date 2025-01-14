import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, trace?: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (trace) {
      console.error(trace);
    }
  }
}
