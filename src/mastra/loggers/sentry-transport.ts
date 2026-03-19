import { createCustomTransport } from "@mastra/core/logger";
import { PinoLogger } from "@mastra/loggers";
import pinoSentry from "pino-sentry-transport";

const sentryStream = await pinoSentry({
  sentry: {
    dsn: process.env.SENTRY_DSN!,
    _experiments: {
      enableLogs: true
    }
  }
});

const customTransport = createCustomTransport(sentryStream);

export const sentryLogger = new PinoLogger({
  name: "mastra-act-1",
  level: "debug",
  transports: { sentry: customTransport }
  //   overrideDefaultTransports: true
});
