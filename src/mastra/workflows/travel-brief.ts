import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const fetchWeather = createStep({
  id: "fetch-weather",
  description: "Fetch weather data for the destination city",
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    city: z.string(),
    temperature: z.number(),
    condition: z.string(),
    humidity: z.number(),
  }),
  execute: async ({ inputData, mastra }) => {
    const logger = mastra.getLogger();
    logger.info(`Fetching weather for travel brief: ${inputData.city}`);

    const conditions = ["sunny", "cloudy", "rainy", "partly cloudy", "overcast"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 35) + 5;
    const humidity = Math.floor(Math.random() * 60) + 30;

    logger.info(`Weather fetched: ${temperature}C, ${condition}`);

    return {
      city: inputData.city,
      temperature,
      condition,
      humidity,
    };
  },
});

const generatePackingList = createStep({
  id: "generate-packing-list",
  description: "Generate a packing list based on weather conditions",
  inputSchema: z.object({
    city: z.string(),
    temperature: z.number(),
    condition: z.string(),
    humidity: z.number(),
  }),
  outputSchema: z.object({
    packingList: z.array(z.string()),
    weatherSummary: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const logger = mastra.getLogger();
    logger.info(`Generating packing list for ${inputData.city}`);

    const agent = mastra.getAgent("summarizer-agent");
    const result = await agent.generate([
      {
        role: "user",
        content: `Based on these weather conditions for ${inputData.city}:
- Temperature: ${inputData.temperature}C
- Condition: ${inputData.condition}
- Humidity: ${inputData.humidity}%

Generate a packing list of 5-8 items. Return ONLY the items, one per line, no numbering or bullets.`,
      },
    ]);

    const packingList = result.text
      .split("\n")
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);

    const weatherSummary = `${inputData.city}: ${inputData.temperature}C, ${inputData.condition}, ${inputData.humidity}% humidity`;

    logger.info(`Packing list generated with ${packingList.length} items`);

    return {
      packingList,
      weatherSummary,
    };
  },
});

const compileBrief = createStep({
  id: "compile-brief",
  description: "Compile the final travel brief",
  inputSchema: z.object({
    packingList: z.array(z.string()),
    weatherSummary: z.string(),
  }),
  outputSchema: z.object({
    brief: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const logger = mastra.getLogger();
    logger.info("Compiling final travel brief");

    const agent = mastra.getAgent("summarizer-agent");
    const result = await agent.generate([
      {
        role: "user",
        content: `Write a short travel brief (3-4 sentences) based on:
Weather: ${inputData.weatherSummary}
Packing list: ${inputData.packingList.join(", ")}

Keep it practical and friendly.`,
      },
    ]);

    logger.info("Travel brief compiled");

    return {
      brief: result.text,
    };
  },
});

export const travelBriefWorkflow = createWorkflow({
  id: "travel-brief",
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    brief: z.string(),
  }),
})
  .then(fetchWeather)
  .then(generatePackingList)
  .then(compileBrief)
  .commit();
