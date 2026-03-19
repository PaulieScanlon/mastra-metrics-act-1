import "dotenv/config";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true
});

setTimeout(() => {
  Sentry.logger.info("Test triggered test log", { action: "test_log" });
}, 2000);
