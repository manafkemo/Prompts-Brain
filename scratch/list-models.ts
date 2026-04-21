import * as fs from 'fs';
import * as path from 'path';

const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
const apiKey = apiKeyMatch ? apiKeyMatch[1] : '';

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json() as { models: { name: string }[] };
    console.log("Available models:");
    data.models.forEach((m) => console.log(m.name));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
