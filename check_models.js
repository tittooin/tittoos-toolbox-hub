
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyApnoNTD58tRsN3nICUQCaEYMeV-rh_mGM";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // The SDK might not expose listModels directly on genAI instance in all versions?
        // Actually it usually does via a specific manager, or we can try a simple generation to test.

        // Let's try to find a working model by brute forcing common names
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-1.5-flash-latest"];

        for (const modelName of models) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`SUCCESS: ${modelName} works!`);
                return;
            } catch (e) {
                console.log(`FAILED: ${modelName} - ${e.message.split(':')[0]}`);
            }
        }
    } catch (error) {
        console.error("Fatal error", error);
    }
}

listModels();
