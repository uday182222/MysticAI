import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function analyzePalmImage(base64Image: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert palmist with decades of experience in palm reading and analysis. Analyze the provided palm image and provide detailed insights. Return your analysis in JSON format with the following structure:

{
  "personalityOverview": "Detailed personality analysis based on palm features",
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "lifeEnergyPercentage": 85,
  "emotionalBalancePercentage": 92,
  "careerPotentialPercentage": 78,
  "loveAndRelationships": {
    "heartLineAnalysis": "Analysis of the heart line and its implications",
    "compatibilityInsights": "Relationship compatibility insights",
    "relationshipStrength": "High|Medium|Low"
  },
  "careerAndSuccess": {
    "professionalStrengths": "Professional strengths based on palm analysis",
    "recommendedPaths": ["path1", "path2", "path3"],
    "successPotential": "Very High|High|Medium|Low"
  },
  "healthAndWellness": {
    "lifeLineInsights": "Life line analysis and health insights",
    "wellnessRecommendations": ["recommendation1", "recommendation2", "recommendation3"],
    "vitalityLevel": "Strong|Moderate|Weak"
  },
  "futureInsights": {
    "nearFuture": "Predictions for the next 1-3 years",
    "lifePathDirection": "Overall life path direction insights",
    "pathClarity": "High|Medium|Low"
  },
  "palmLines": {
    "heartLine": "Description of heart line characteristics",
    "headLine": "Description of head line characteristics", 
    "lifeLine": "Description of life line characteristics",
    "fateLine": "Description of fate line characteristics"
  }
}

Focus on traditional palmistry principles including line analysis, mounts, finger analysis, and overall palm shape. Provide positive, constructive insights while being specific and detailed.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this palm image and provide a comprehensive palmistry reading. Focus on the major lines, mounts, and overall palm characteristics to give insights about personality, relationships, career, health, and future prospects."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI palm analysis error:", error);
    throw new Error("Failed to analyze palm image: " + (error as Error).message);
  }
}
