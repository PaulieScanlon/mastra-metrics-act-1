import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "weather-lookup",
  description: "Look up the current weather for a given city",
  inputSchema: z.object({
    city: z.string().describe("The city to look up weather for"),
  }),
  outputSchema: z.object({
    city: z.string(),
    temperature: z.number(),
    unit: z.string(),
    condition: z.string(),
    humidity: z.number(),
    windSpeed: z.number(),
  }),
  execute: async (input, context) => {
    const logger = context?.mastra?.getLogger();
    logger?.info(`Looking up weather for ${input.city}`);

    // Simulated weather data
    const conditions = ["sunny", "cloudy", "rainy", "partly cloudy", "overcast"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 35) + 5;
    const humidity = Math.floor(Math.random() * 60) + 30;
    const windSpeed = Math.floor(Math.random() * 30) + 2;

    logger?.info(`Weather result for ${input.city}: ${temperature}C, ${condition}`);

    return {
      city: input.city,
      temperature,
      unit: "celsius",
      condition,
      humidity,
      windSpeed,
    };
  },
});
