import OpenAI from "openai";
import { AstrologyInput, VastuInput, NumerologyInput } from "@shared/schema";

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
      max_completion_tokens: 2000,
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
      model: "gpt-4o",
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
      max_completion_tokens: 3000,
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
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_completion_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI Vastu analysis error:", error);
    throw new Error("Failed to analyze Vastu layout: " + (error as Error).message);
  }
}

export async function analyzeNumerology(numerologyData: NumerologyInput): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert numerologist with deep knowledge of Pythagorean and Chaldean numerology systems. Analyze the provided information and calculate core numbers with detailed insights. Return your analysis in JSON format with the following structure:

{
  "personalityOverview": "Comprehensive personality analysis based on numerological calculations",
  "coreNumbers": {
    "lifePathNumber": {
      "number": 7,
      "meaning": "Detailed meaning of the life path number",
      "traits": ["trait1", "trait2", "trait3", "trait4"]
    },
    "destinyNumber": {
      "number": 5,
      "meaning": "Detailed meaning of the destiny number",
      "purpose": "Life purpose and ultimate goals"
    },
    "soulUrgeNumber": {
      "number": 3,
      "meaning": "Detailed meaning of the soul urge number",
      "desires": "Inner desires and motivations"
    },
    "personalityNumber": {
      "number": 9,
      "meaning": "Detailed meaning of the personality number",
      "impression": "How others perceive you"
    }
  },
  "lifeAreas": {
    "strengths": ["strength1", "strength2", "strength3", "strength4"],
    "challenges": ["challenge1", "challenge2", "challenge3"],
    "careerPath": "Ideal career paths and professional guidance",
    "relationships": "Relationship patterns and compatibility insights",
    "luckyNumbers": [7, 14, 21, 28],
    "favorableColors": ["color1", "color2", "color3"]
  },
  "predictions": {
    "currentYear": "Analysis of current year's energy and focus areas",
    "nextPhase": "What to expect in the next phase of life",
    "opportunities": ["opportunity1", "opportunity2", "opportunity3"]
  }
}

Calculate numbers using traditional numerological methods. For Life Path, reduce birth date to single digit. For Destiny/Expression, use full birth name. For Soul Urge, use vowels in name. For Personality, use consonants in name. Provide positive, empowering insights while being specific and actionable.`
        },
        {
          role: "user",
          content: `Please analyze my numerology with the following details:
${numerologyData.analysisType === 'personal' ? `
Analysis Type: Personal Numerology
Full Name: ${numerologyData.name}
Birth Date: ${numerologyData.birthDate}

Calculate my Life Path Number from birth date, Destiny Number from full name, Soul Urge Number from vowels, and Personality Number from consonants. Provide comprehensive insights about my personality, life purpose, strengths, challenges, and future guidance.` : `
Analysis Type: Business Numerology  
Company Name: ${numerologyData.companyName}

Calculate the business destiny number from the company name and provide insights about business potential, success factors, favorable activities, and growth opportunities.`}

Provide detailed numerological analysis with practical guidance for personal and professional development.`
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 3000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI numerology analysis error:", error);
    throw new Error("Failed to analyze numerology: " + (error as Error).message);
  }
}
