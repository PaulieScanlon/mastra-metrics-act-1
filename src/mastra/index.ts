import { Mastra } from "@mastra/core";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { Observability, DefaultExporter, SensitiveDataFilter } from "@mastra/observability";
import { researchAgent } from "./agents/research-agent";
import { summarizerAgent } from "./agents/summarizer-agent";
import { travelBriefWorkflow } from "./workflows/travel-brief";
import { weatherTool } from "./tools/weather-tool";
import { stockTool } from "./tools/stock-tool";

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
  logger: new PinoLogger({
    name: "mastra-act-1",
    level: "debug"
  }),
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: "file:./mastra.db"
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra-metrics-act-1",
        exporters: [new DefaultExporter({ strategy: "realtime" })],
        spanOutputProcessors: [new SensitiveDataFilter()]
      }
    }
  })
});
