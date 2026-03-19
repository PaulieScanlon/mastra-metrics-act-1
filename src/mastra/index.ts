import { Mastra } from "@mastra/core";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { researchAgent } from "./agents/research-agent";
import { summarizerAgent } from "./agents/summarizer-agent";
import { travelBriefWorkflow } from "./workflows/travel-brief";
import { weatherTool } from "./tools/weather-tool";
import { stockTool } from "./tools/stock-tool";

import { sentryLogger } from "./loggers/sentry-transport";

export const mastra = new Mastra({
  agents: {
    "research-agent": researchAgent,
    "summarizer-agent": summarizerAgent
  },
  tools: {
    weatherTool,
    stockTool
  },
  workflows: {
    "travel-brief": travelBriefWorkflow
  },
  // logger: sentryLogger,
  logger: new PinoLogger({
    name: "mastra-act-1",
    level: "debug"
  }),
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: "file:./mastra.db"
  })
});
