/**
 * LOGGER UTILITY
 * Centralized logging for all services
 * - Console output with timestamps and levels
 * - No external dependencies (production lightweight)
 * - Structured logging format
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

class Logger {
  private logLevel: LogLevel;
  private isDev: boolean;

  constructor() {
    const envLogLevel = process.env.LOG_LEVEL?.toUpperCase() as LogLevel | undefined;
    this.logLevel = (envLogLevel && Object.values(LogLevel).includes(envLogLevel))
      ? envLogLevel
      : process.env.NODE_ENV === 'production'
        ? LogLevel.INFO
        : LogLevel.DEBUG;

    this.isDev = process.env.NODE_ENV !== 'production';
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, context?: unknown): string {
    const timestamp = this.formatTimestamp();
    const levelStr = `[${level}]`;

    if (context) {
      return `${timestamp} ${levelStr} ${message}`;
    }

    return `${timestamp} ${levelStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.logLevel];
  }

  private printLog(
    level: LogLevel,
    message: string,
    context?: unknown,
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formatted = this.formatMessage(level, message, context);

    // Color coding for console output
    const colors = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m', // Green
      WARN: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
      RESET: '\x1b[0m', // Reset
    };

    const colorCode = colors[level as keyof typeof colors];
    const resetCode = colors.RESET;

    if (context && this.isDev) {
      console.log(`${colorCode}${formatted}${resetCode}`);
      if (context instanceof Error) {
        console.error(context.stack);
      } else {
        console.log('Context:', JSON.stringify(context, null, 2));
      }
    } else {
      console.log(`${colorCode}${formatted}${resetCode}`);
    }
  }

  debug(message: string, context?: unknown): void {
    this.printLog(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: unknown): void {
    this.printLog(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: unknown): void {
    this.printLog(LogLevel.WARN, message, context);
  }

  error(message: string, context?: unknown): void {
    this.printLog(LogLevel.ERROR, message, context);
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;
