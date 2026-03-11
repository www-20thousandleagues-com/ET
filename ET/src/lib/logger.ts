type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/** Creates a structured log entry with ISO timestamp, level, message, and optional context. */
function createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context && { context }),
  };
}

/** Serializes a LogEntry to JSON and writes it to the appropriate console method (error/warn/log). */
function log(entry: LogEntry): void {
  const output = JSON.stringify(entry);
  switch (entry.level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    default:
      console.log(output);
  }
}

/**
 * Structured JSON logger. Each method outputs a JSON string with level, message, timestamp, and optional context.
 * Routes error/warn to console.error/warn; debug/info to console.log.
 */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log(createLogEntry("debug", message, context)),
  info: (message: string, context?: Record<string, unknown>) => log(createLogEntry("info", message, context)),
  warn: (message: string, context?: Record<string, unknown>) => log(createLogEntry("warn", message, context)),
  error: (message: string, context?: Record<string, unknown>) => log(createLogEntry("error", message, context)),
};
