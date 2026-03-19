import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";
import { stockTool } from "../tools/stock-tool";

export const researchAgent = new Agent({
  id: "research-agent",
  name: "Research Agent",
  instructions: `You are a research assistant that helps users get real-time information.

You MUST use your tools to answer questions. NEVER answer from your own knowledge.

- For any weather question, call the weatherTool for each city mentioned.
- For any stock question, call the stockTool for each ticker mentioned.
- If a user asks about multiple things, call the relevant tool for each one.

After gathering tool results, present the data in a clear, readable format.`,
  model: "openai/gpt-4o-mini",
  tools: { weatherTool, stockTool },
});
