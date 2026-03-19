import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const stockTool = createTool({
  id: "stock-lookup",
  description: "Look up the current stock price and daily change for a given ticker symbol",
  inputSchema: z.object({
    ticker: z.string().describe("The stock ticker symbol, e.g. AAPL, GOOGL, TSLA"),
  }),
  outputSchema: z.object({
    ticker: z.string(),
    price: z.number(),
    currency: z.string(),
    change: z.number(),
    changePercent: z.number(),
    volume: z.number(),
  }),
  execute: async (input, context) => {
    const logger = context?.mastra?.getLogger();
    logger?.info(`Looking up stock price for ${input.ticker}`);

    // Simulated stock data
    const basePrice = Math.floor(Math.random() * 400) + 20;
    const change = parseFloat((Math.random() * 10 - 5).toFixed(2));
    const changePercent = parseFloat(((change / basePrice) * 100).toFixed(2));
    const volume = Math.floor(Math.random() * 50000000) + 1000000;

    logger?.info(`Stock result for ${input.ticker}: $${basePrice}, change: ${change}`);

    return {
      ticker: input.ticker.toUpperCase(),
      price: basePrice,
      currency: "USD",
      change,
      changePercent,
      volume,
    };
  },
});
