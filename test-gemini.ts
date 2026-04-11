import { analyzePrompt } from './lib/gemini.js';
import * as fs from 'fs';
import * as path from 'path';

// Minimal .env.local parser for our test script
const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
if (apiKeyMatch) {
  process.env.GEMINI_API_KEY = apiKeyMatch[1];
}

async function test() {
  const samplePrompt = "Create a hyper-realistic 4k image of a futuristic cyberpunk city at night with neon lights and flying cars.";
  console.log("Analyzing prompt: ", samplePrompt);
  try {
    const result = await analyzePrompt(samplePrompt);
    console.log("Success! Gemini Analysis:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error analyzing prompt:", error);
  }
}

test();
