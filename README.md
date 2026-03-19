# Mastra Metrics Launch - Act 1: The Blind Spot — Logs

A demo app for exploring Mastra's logging. Two agents, two tools, one workflow, all wired up with PinoLogger. Logs output to the terminal where you run `mastra dev`.

## Setup

1. Create a `.env` file:

```
OPENAI_API_KEY=sk-your-key-here
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open Studio at `http://localhost:4111`
5. Keep the terminal visible — that's where logs appear

## Test 1: Agent with tools (Research Agent)

Go to **Agents > research-agent** and try these prompts:

- "What's the weather in Paris and Tokyo?"
- "How's AAPL doing today?"
- "Compare the weather in London and New York, and check the stock price of GOOGL"

The last one is the most interesting because it triggers multiple tool calls in a single agent run.

### What to look for in the terminal

Switch to the terminal running `mastra dev`. You'll see structured log output from PinoLogger:

- Each tool call logs when it starts: `Looking up weather for Paris`
- Each tool call logs the result: `Weather result for Paris: 22°C, sunny`
- The stock tool logs similarly: `Looking up stock price for GOOGL`
- For multi-tool prompts, you'll see interleaved log lines from different tool calls

**What's useful:**

- You can see that the tools were called and what they returned
- Timestamps tell you roughly when things happened
- Log levels (info, debug, error) help you filter signal from noise

**What's limited:**

- You can't tell which tool calls belong to which agent run without reading carefully
- There's no hierarchy — the logs are a flat stream of lines
- If you ran multiple prompts, the logs from different runs are mixed together
- You can't see how long anything took without manually comparing timestamps
- There's no way to click into a log line and see the full context of what happened around it

This is the blind spot. Logs tell you *what* happened, but not *why* or *how it connects*.

## Test 2: Agent without tools (Summarizer Agent)

Go to **Agents > summarizer-agent** and paste any block of text, then ask for a summary.

```
Summarize this
Cats are small, typically furry, carnivorous mammals that have been domesticated for thousands of years. They are known for their independence, agility, and companionship.
Physical Characteristics
Body Structure: Agile and flexible, with a spine capable of extreme twisting and 230-244 bones (more than humans).
Claws: Retractable claws (except for the cheetah) that are kept sharp by sheathing.
Senses: Excellent night vision (requiring 1/6th the light of humans) and highly sensitive hearing that can detect ultrasonic sounds.
Whiskers: Highly sensitive whiskers (vibrissae) act as radars to detect air currents and navigate in the dark.
Unique Paw pads: Act as shock absorbers, and they sweat through their pads.
Grooming: Possess rasplike tongues covered in papillae for cleaning fur and removing loose hair.
```

### What to look for in the terminal

- This agent has no tools, so the terminal is quieter — you'll only see framework-level log output
- Compare the volume of logs to the research agent: fewer log lines because there are no tool calls generating logger.info() messages
- Without tools logging their activity, you have almost no visibility into what the agent did

## Test 3: Workflow (Travel Brief)

Go to **Workflows > travel-brief** and run it with:

```json
{ "city": "Barcelona" }
```

This runs three sequential steps:

1. **fetch-weather** — gets weather data for the city
2. **generate-packing-list** — calls the summarizer agent to create a packing list based on the weather
3. **compile-brief** — calls the summarizer agent again to write the final travel brief

### What to look for in the terminal

- The workflow steps log as they execute: "Fetching weather for travel brief: Barcelona"
- You'll see weather data logged, then the packing list step starting, then the compile step
- The logs appear in order because the steps run sequentially

**The problem becomes clearer with workflows:**

- You can see that three things happened, but the logs don't show you that they're part of the same workflow run
- If you ran the workflow twice in a row, the logs from both runs would be interleaved with no clear boundary between them
- You can't tell from the logs how long each step took or where time was spent
- If a step failed, you'd see an error log but you'd have to scroll up and piece together what led to it

## The takeaway

After running all three tests, scroll through the terminal output. You have a wall of log lines. You know things happened. But try answering these questions from the logs alone:

- How long did the weather tool take compared to the stock tool?
- Which agent run triggered which tool calls?
- Did the workflow steps pass data correctly between them?
- Where was the bottleneck in the workflow?

That's the blind spot. Logs give you raw signal, but no structure. Act 2 introduces traces, which connect the dots.
