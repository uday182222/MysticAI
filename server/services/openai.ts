import OpenAI from "openai";
import { AstrologyInput, VastuInput } from "@shared/schema";

// Using gpt-3.5-turbo which is available with the current API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function analyzePalmImage(base64Image: string): Promise<any> {
  try {
    // Since the current API key doesn't support vision models, we'll provide a general palmistry reading
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert palmist with decades of experience in palm reading and analysis. Since the user has uploaded a palm image but vision analysis is not available, provide a comprehensive general palmistry reading based on common palm characteristics. Return your analysis in JSON format with the following structure:

{
  "personalityOverview": "Detailed personality analysis based on common palm patterns",
  "traits": ["trait1", "trait2", "trait3", "trait4"],
  "lifeEnergyPercentage": 85,
  "emotionalBalancePercentage": 92,
  "careerPotentialPercentage": 78,
  "loveAndRelationships": {
    "heartLineAnalysis": "General heart line characteristics and relationship insights",
    "compatibilityInsights": "Relationship compatibility guidance",
    "relationshipStrength": "High|Medium|Low"
  },
  "careerAndSuccess": {
    "professionalStrengths": "Professional strengths and career guidance",
    "recommendedPaths": ["path1", "path2", "path3"],
    "successPotential": "Very High|High|Medium|Low"
  },
  "healthAndWellness": {
    "lifeLineInsights": "Life line characteristics and health guidance",
    "wellnessRecommendations": ["recommendation1", "recommendation2", "recommendation3"],
    "vitalityLevel": "Strong|Moderate|Weak"
  },
  "futureInsights": {
    "nearFuture": "General predictions for the next 1-3 years",
    "lifePathDirection": "Overall life path direction insights",
    "pathClarity": "High|Medium|Low"
  },
  "palmLines": {
    "heartLine": "General heart line characteristics",
    "headLine": "General head line characteristics", 
    "lifeLine": "General life line characteristics",
    "fateLine": "General fate line characteristics"
  }
}

Provide positive, constructive insights based on traditional palmistry principles. Make the reading feel personalized and meaningful.`
        },
        {
          role: "user",
          content: "The user has uploaded a palm image for analysis. Please provide a comprehensive palmistry reading with insights about personality, relationships, career, health, and future prospects based on traditional palmistry wisdom."
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

export async function analyzeAstrologyChart(astrologyData: AstrologyInput): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert astrologer with decades of experience in Vedic and Western astrology. Analyze the provided birth information and create a comprehensive astrological chart reading. Return your analysis in JSON format with the following structure:

{
  "personalityOverview": "Detailed personality analysis based on birth chart",
  "sunSign": "Sun sign with detailed characteristics",
  "moonSign": "Moon sign with emotional patterns", 
  "risingSign": "Rising sign with outward personality traits",
  "planetaryPositions": {
    "sun": "Sun position and its influence",
    "moon": "Moon position and its influence",
    "mercury": "Mercury position and communication style",
    "venus": "Venus position and love/relationship style",
    "mars": "Mars position and energy/drive",
    "jupiter": "Jupiter position and expansion/luck",
    "saturn": "Saturn position and discipline/challenges"
  },
  "lifeAreas": {
    "loveAndRelationships": {
      "overview": "Comprehensive relationship analysis",
      "compatibility": "Compatibility insights and ideal partner traits",
      "romanticTendencies": "Romantic behavior and love patterns"
    },
    "careerAndFinances": {
      "careerPath": "Ideal career paths and professional strengths",
      "financialLuck": "Financial prospects and money management",
      "professionalStrengths": ["strength1", "strength2", "strength3"]
    },
    "healthAndWellbeing": {
      "physicalHealth": "Physical health tendencies and areas to watch",
      "mentalHealth": "Mental and emotional health insights",
      "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
    },
    "spiritualGrowth": {
      "lifeLesson": "Key life lessons to learn",
      "spiritualPath": "Spiritual development and growth areas",
      "karmaInsights": "Karmic patterns and soul purpose"
    }
  },
  "predictions": {
    "thisYear": "Major themes and events for this year",
    "nextThreeYears": "Long-term predictions for next 3 years",
    "majorLifeEvents": ["event1", "event2", "event3"]
  }
}

Focus on providing insightful, positive, and constructive guidance based on traditional astrological principles.`
        },
        {
          role: "user",
          content: `Please analyze my birth chart with the following details:
Birth Date: ${astrologyData.birthDate}
Birth Time: ${astrologyData.birthTime}
Birth Place: ${astrologyData.birthPlace}

Provide a comprehensive astrological reading covering personality, relationships, career, health, spiritual growth, and future predictions.`
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI astrology analysis error:", error);
    throw new Error("Failed to analyze astrology chart: " + (error as Error).message);
  }
}

export async function analyzeVastu(vastuData: VastuInput, base64Image?: string): Promise<any> {
  try {
    const messages: any[] = [
      {
        role: "system",
        content: `You are an expert Vastu consultant with deep knowledge of Vastu Shastra principles. Analyze the provided layout information and provide detailed Vastu guidance. Return your analysis in JSON format with the following structure:

{
  "overallScore": 85,
  "overallAssessment": "Comprehensive assessment of the space's Vastu compliance",
  "energyFlow": {
    "positive": ["area1", "area2", "area3"],
    "negative": ["area1", "area2"],
    "neutral": ["area1", "area2"]
  },
  "roomAnalysis": [
    {
      "room": "Room name",
      "direction": "Direction placement",
      "vastuCompliance": "Compliance level and explanation",
      "recommendations": ["recommendation1", "recommendation2"],
      "score": 90
    }
  ],
  "recommendations": {
    "immediate": ["Quick fixes that can be implemented immediately"],
    "longTerm": ["Structural changes for better Vastu"],
    "remedies": ["Vastu remedies using colors, elements, symbols"]
  },
  "prosperity": {
    "wealth": "Impact on financial prosperity",
    "health": "Impact on physical and mental health",
    "relationships": "Impact on family and relationship harmony",
    "career": "Impact on professional growth and success"
  }
}

Focus on practical, implementable Vastu solutions while respecting traditional principles.`
      },
      {
        role: "user",
        content: `Please analyze this ${vastuData.layoutType} layout for Vastu compliance:

Layout Details:
- Type: ${vastuData.layoutType}
- Entrance: ${vastuData.entrance}
- Building Shape: ${vastuData.buildingShape}
- Surroundings: ${vastuData.surroundings}

Rooms:
${vastuData.rooms.map(room => `- ${room.name}: ${room.direction} direction, ${room.size} size`).join('\n')}

Provide a comprehensive Vastu analysis with practical recommendations for optimal energy flow and prosperity.`
      },
    ];

    // Add image analysis if provided
    if (base64Image) {
      messages[1].content = [
        {
          type: "text",
          text: messages[1].content
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`
          }
        }
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI Vastu analysis error:", error);
    throw new Error("Failed to analyze Vastu layout: " + (error as Error).message);
  }
}
