const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// List of models to try in order of preference
const MODELS = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];

async function generateContent(prompt) {
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            console.log(`Attempting review with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                systemInstruction: `You are a Senior Code Reviewer. Suggest improvements in a Bad/Good comparison format.`
            });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            lastError = error;
            console.warn(`Model ${modelName} failed: ${error.message}`);
            // If it's a 404 or 429, we try the next model
            continue;
        }
    }

    throw new Error(`All models failed. Last error: ${lastError?.message}`);
}

module.exports = generateContent