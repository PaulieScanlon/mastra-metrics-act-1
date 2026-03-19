import { Agent } from "@mastra/core/agent";

export const summarizerAgent = new Agent({
  id: "summarizer-agent",
  name: "Summarizer Agent",
  instructions: `You are a summarization assistant. Given any text, you produce a clear, concise summary.

Rules:
- Preserve the key facts and figures
- Keep summaries to 2-3 sentences unless the user asks for more detail
- Use plain language
- If the input contains data points (numbers, dates, names), include them in the summary`,
  model: "openai/gpt-4o-mini",
});
