import OpenAI from "openai";
import { z } from "zod";
import { AstrologyInput, VastuInput, NumerologyInput, TarotInput } from "@shared/schema";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// Function definitions for each analysis type
const palmAnalysisFunction = {
  name: "analyze_palm_reading",
  description: "Analyze a palm image and provide comprehensive palmistry insights including personality, relationships, career, health, and future predictions.",
  parameters: {
    type: "object",
    properties: {
      personalityOverview: {
        type: "string",
        description: "Detailed personality analysis based on palm features"
      },
      traits: {
        type: "array",
        items: { type: "string" },
        description: "Key personality traits identified from palm analysis"
      },
      lifeEnergyPercentage: {
        type: "number",
        description: "Life energy percentage (0-100)"
      },
      emotionalBalancePercentage: {
        type: "number", 
        description: "Emotional balance percentage (0-100)"
      },
      careerPotentialPercentage: {
        type: "number",
        description: "Career potential percentage (0-100)"
      },
      loveAndRelationships: {
        type: "object",
        properties: {
          heartLineAnalysis: {
            type: "string",
            description: "Analysis of the heart line and its implications"
          },
          compatibilityInsights: {
            type: "string",
            description: "Relationship compatibility insights"
          },
          relationshipStrength: {
            type: "string",
            enum: ["High", "Medium", "Low"],
            description: "Overall relationship strength"
          }
        },
        required: ["heartLineAnalysis", "compatibilityInsights", "relationshipStrength"]
      },
      careerAndSuccess: {
        type: "object",
        properties: {
          professionalStrengths: {
            type: "string",
            description: "Professional strengths based on palm analysis"
          },
          recommendedPaths: {
            type: "array",
            items: { type: "string" },
            description: "Recommended career paths"
          },
          successPotential: {
            type: "string",
            enum: ["Very High", "High", "Medium", "Low"],
            description: "Success potential level"
          }
        },
        required: ["professionalStrengths", "recommendedPaths", "successPotential"]
      },
      healthAndWellness: {
        type: "object",
        properties: {
          lifeLineInsights: {
            type: "string",
            description: "Life line analysis and health insights"
          },
          wellnessRecommendations: {
            type: "array",
            items: { type: "string" },
            description: "Wellness recommendations"
          },
          vitalityLevel: {
            type: "string",
            enum: ["Strong", "Moderate", "Weak"],
            description: "Overall vitality level"
          }
        },
        required: ["lifeLineInsights", "wellnessRecommendations", "vitalityLevel"]
      },
      futureInsights: {
        type: "object",
        properties: {
          nearFuture: {
            type: "string",
            description: "Predictions for the next 1-3 years"
          },
          lifePathDirection: {
            type: "string",
            description: "Overall life path direction insights"
          },
          pathClarity: {
            type: "string",
            enum: ["High", "Medium", "Low"],
            description: "Clarity of life path direction"
          }
        },
        required: ["nearFuture", "lifePathDirection", "pathClarity"]
      },
      palmLines: {
        type: "object",
        properties: {
          heartLine: {
            type: "string",
            description: "Description of heart line characteristics"
          },
          headLine: {
            type: "string",
            description: "Description of head line characteristics"
          },
          lifeLine: {
            type: "string",
            description: "Description of life line characteristics"
          },
          fateLine: {
            type: "string",
            description: "Description of fate line characteristics"
          }
        },
        required: ["heartLine", "headLine", "lifeLine", "fateLine"]
      }
    },
    required: [
      "personalityOverview", "traits", "lifeEnergyPercentage", "emotionalBalancePercentage",
      "careerPotentialPercentage", "loveAndRelationships", "careerAndSuccess", 
      "healthAndWellness", "futureInsights", "palmLines"
    ]
  }
};

// Zod schemas for validation
const PalmAnalysisResultSchema = z.object({
  personalityOverview: z.string(),
  traits: z.array(z.string()),
  lifeEnergyPercentage: z.number().min(0).max(100),
  emotionalBalancePercentage: z.number().min(0).max(100),
  careerPotentialPercentage: z.number().min(0).max(100),
  loveAndRelationships: z.object({
    heartLineAnalysis: z.string(),
    compatibilityInsights: z.string(),
    relationshipStrength: z.enum(["High", "Medium", "Low"])
  }),
  careerAndSuccess: z.object({
    professionalStrengths: z.string(),
    recommendedPaths: z.array(z.string()),
    successPotential: z.enum(["Very High", "High", "Medium", "Low"])
  }),
  healthAndWellness: z.object({
    lifeLineInsights: z.string(),
    wellnessRecommendations: z.array(z.string()),
    vitalityLevel: z.enum(["Strong", "Moderate", "Weak"])
  }),
  futureInsights: z.object({
    nearFuture: z.string(),
    lifePathDirection: z.string(),
    pathClarity: z.enum(["High", "Medium", "Low"])
  }),
  palmLines: z.object({
    heartLine: z.string(),
    headLine: z.string(),
    lifeLine: z.string(),
    fateLine: z.string()
  })
});

const AstrologyAnalysisResultSchema = z.object({
  personalityOverview: z.string(),
  sunSign: z.string(),
  moonSign: z.string(),
  risingSign: z.string(),
  kundliChart: z.object({
    houses: z.array(z.object({
      number: z.number(),
      sign: z.string(),
      planets: z.array(z.string()),
      ruling: z.string()
    })),
    planetaryPositions: z.object({
      sun: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      moon: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      mercury: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      venus: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      mars: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      jupiter: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      saturn: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      rahu: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
      ketu: z.object({ sign: z.string(), house: z.number(), degrees: z.number() })
    }),
    aspects: z.array(z.object({
      from: z.string(),
      to: z.string(),
      type: z.string(),
      influence: z.string()
    }))
  }),
  planetaryPositions: z.object({
    sun: z.string(),
    moon: z.string(),
    mercury: z.string(),
    venus: z.string(),
    mars: z.string(),
    jupiter: z.string(),
    saturn: z.string()
  }),
  lifeAreas: z.object({
    loveAndRelationships: z.object({
      overview: z.string(),
      compatibility: z.string(),
      romanticTendencies: z.string()
    }),
    careerAndFinances: z.object({
      careerPath: z.string(),
      financialLuck: z.string(),
      professionalStrengths: z.array(z.string())
    }),
    healthAndWellbeing: z.object({
      physicalHealth: z.string(),
      mentalHealth: z.string(),
      recommendations: z.array(z.string())
    }),
    spiritualGrowth: z.object({
      lifeLesson: z.string(),
      spiritualPath: z.string(),
      karmaInsights: z.string()
    })
  }),
  predictions: z.object({
    thisYear: z.string(),
    nextThreeYears: z.string(),
    majorLifeEvents: z.array(z.string())
  })
});

const VastuAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  overallAssessment: z.string(),
  energyFlow: z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string()),
    neutral: z.array(z.string())
  }),
  roomAnalysis: z.array(z.object({
    room: z.string(),
    direction: z.string(),
    vastuCompliance: z.string(),
    recommendations: z.array(z.string()),
    score: z.number().min(0).max(100)
  })),
  recommendations: z.object({
    immediate: z.array(z.string()),
    longTerm: z.array(z.string()),
    remedies: z.array(z.string())
  }),
  prosperity: z.object({
    wealth: z.string(),
    health: z.string(),
    relationships: z.string(),
    career: z.string()
  })
});

const NumerologyAnalysisResultSchema = z.object({
  personalityOverview: z.string(),
  coreNumbers: z.object({
    lifePathNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      traits: z.array(z.string())
    }),
    destinyNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      purpose: z.string()
    }),
    soulUrgeNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      desires: z.string()
    }),
    personalityNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      impression: z.string()
    })
  }),
  lifeAreas: z.object({
    strengths: z.array(z.string()),
    challenges: z.array(z.string()),
    careerPath: z.string(),
    relationships: z.string(),
    luckyNumbers: z.array(z.number()),
    favorableColors: z.array(z.string())
  }),
  predictions: z.object({
    currentYear: z.string(),
    nextPhase: z.string(),
    opportunities: z.array(z.string())
  })
});

const TarotAnalysisResultSchema = z.object({
  spreadType: z.string(),
  personalityOverview: z.string(),
  cardAnalysis: z.array(z.object({
    position: z.string(),
    cardName: z.string(),
    meaning: z.string(),
    interpretation: z.string(),
    reversed: z.boolean(),
    reversedMeaning: z.string().optional()
  })),
  overallMessage: z.string(),
  guidance: z.object({
    pastInfluences: z.string().optional(),
    presentSituation: z.string(),
    futureOutlook: z.string().optional(),
    advice: z.string(),
    outcome: z.string().optional()
  }),
  actionSteps: z.array(z.string()),
  reflection: z.string()
});

// Export TypeScript types
export type PalmAnalysisResult = z.infer<typeof PalmAnalysisResultSchema>;
export type AstrologyAnalysisResult = z.infer<typeof AstrologyAnalysisResultSchema>;
export type VastuAnalysisResult = z.infer<typeof VastuAnalysisResultSchema>;
export type NumerologyAnalysisResult = z.infer<typeof NumerologyAnalysisResultSchema>;
export type TarotAnalysisResult = z.infer<typeof TarotAnalysisResultSchema>;

export async function analyzePalmImage(base64Image: string): Promise<PalmAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert palmist with decades of experience in palm reading and analysis. Analyze the provided palm image and provide detailed insights based on traditional palmistry principles including line analysis, mounts, finger analysis, and overall palm shape. Provide positive, constructive insights while being specific and detailed.`
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
      tools: [{ type: "function", function: palmAnalysisFunction }],
      tool_choice: "auto",
      max_completion_tokens: 2000,
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || !('function' in toolCall) || toolCall.function.name !== "analyze_palm_reading") {
      throw new Error("Invalid function call response");
    }

    const rawResult = JSON.parse(toolCall.function.arguments);
    
    // Validate with Zod schema
    try {
      const result = PalmAnalysisResultSchema.parse(rawResult);
    return result;
    } catch (validationError) {
      console.error("Palm analysis validation failed:", validationError);
      console.error("Raw OpenAI response:", JSON.stringify(rawResult, null, 2));
      throw new Error("Invalid palm analysis response format");
    }
  } catch (error) {
    console.error("OpenAI palm analysis error:", error);
    throw new Error("Failed to analyze palm image: " + (error as Error).message);
  }
}

const astrologyAnalysisFunction = {
  name: "analyze_astrology_chart",
  description: "Create a comprehensive Kundli (birth chart) analysis using Vedic astrology principles with detailed planetary positions, houses, and life predictions.",
  parameters: {
    type: "object",
    properties: {
      personalityOverview: {
        type: "string",
        description: "Detailed personality analysis based on birth chart"
      },
      sunSign: {
        type: "string",
        description: "Sun sign with detailed characteristics"
      },
      moonSign: {
        type: "string",
        description: "Moon sign with emotional patterns"
      },
      risingSign: {
        type: "string",
        description: "Rising sign (Lagna) with outward personality traits"
      },
      kundliChart: {
        type: "object",
        properties: {
          houses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                number: { type: "number" },
                sign: { type: "string" },
                planets: { type: "array", items: { type: "string" } },
                ruling: { type: "string" }
              },
              required: ["number", "sign", "planets", "ruling"]
            }
          },
          planetaryPositions: {
            type: "object",
            properties: {
              sun: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              moon: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              mercury: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              venus: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              mars: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              jupiter: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              saturn: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              rahu: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] },
              ketu: { type: "object", properties: { sign: { type: "string" }, house: { type: "number" }, degrees: { type: "number" } }, required: ["sign", "house", "degrees"] }
            },
            required: ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "rahu", "ketu"]
          },
          aspects: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: { type: "string" },
                to: { type: "string" },
                type: { type: "string" },
                influence: { type: "string" }
              },
              required: ["from", "to", "type", "influence"]
            }
          }
        },
        required: ["houses", "planetaryPositions", "aspects"]
      },
      planetaryPositions: {
        type: "object",
        properties: {
          sun: { type: "string" },
          moon: { type: "string" },
          mercury: { type: "string" },
          venus: { type: "string" },
          mars: { type: "string" },
          jupiter: { type: "string" },
          saturn: { type: "string" }
        },
        required: ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"]
      },
      lifeAreas: {
        type: "object",
        properties: {
          loveAndRelationships: {
            type: "object",
            properties: {
              overview: { type: "string" },
              compatibility: { type: "string" },
              romanticTendencies: { type: "string" }
            },
            required: ["overview", "compatibility", "romanticTendencies"]
          },
          careerAndFinances: {
            type: "object",
            properties: {
              careerPath: { type: "string" },
              financialLuck: { type: "string" },
              professionalStrengths: { type: "array", items: { type: "string" } }
            },
            required: ["careerPath", "financialLuck", "professionalStrengths"]
          },
          healthAndWellbeing: {
            type: "object",
            properties: {
              physicalHealth: { type: "string" },
              mentalHealth: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } }
            },
            required: ["physicalHealth", "mentalHealth", "recommendations"]
          },
          spiritualGrowth: {
            type: "object",
            properties: {
              lifeLesson: { type: "string" },
              spiritualPath: { type: "string" },
              karmaInsights: { type: "string" }
            },
            required: ["lifeLesson", "spiritualPath", "karmaInsights"]
          }
        },
        required: ["loveAndRelationships", "careerAndFinances", "healthAndWellbeing", "spiritualGrowth"]
      },
      predictions: {
        type: "object",
        properties: {
          thisYear: { type: "string" },
          nextThreeYears: { type: "string" },
          majorLifeEvents: { type: "array", items: { type: "string" } }
        },
        required: ["thisYear", "nextThreeYears", "majorLifeEvents"]
      }
    },
    required: ["personalityOverview", "sunSign", "moonSign", "risingSign", "kundliChart", "planetaryPositions", "lifeAreas", "predictions"]
  }
};

export async function analyzeAstrologyChart(astrologyData: AstrologyInput): Promise<AstrologyAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert Vedic astrologer with decades of experience in Jyotish and birth chart analysis. Analyze the provided birth information and create a comprehensive Kundli (birth chart) reading. Focus on providing insightful, positive, and constructive guidance based on traditional astrological principles.`
        },
        {
          role: "user",
          content: `Please create a detailed Kundli (birth chart) analysis with the following birth details:
Birth Date: ${astrologyData.birthDate}
Birth Time: ${astrologyData.birthTime}
Birth Place: ${astrologyData.birthPlace}

Calculate the exact planetary positions, houses, and aspects for this birth time and location. Generate a complete Kundli chart with:
1. All 12 houses with their signs and ruling planets
2. Precise planetary positions with degrees for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, and Ketu
3. Major planetary aspects and their influences
4. Comprehensive Vedic astrology analysis covering personality, relationships, career, health, spiritual growth, and future predictions

Use traditional Vedic astrology principles and provide accurate astronomical calculations for the birth chart.`
        },
      ],
      tools: [{ type: "function", function: astrologyAnalysisFunction }],
      tool_choice: "auto",
      max_completion_tokens: 3000,
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || !('function' in toolCall) || toolCall.function.name !== "analyze_astrology_chart") {
      throw new Error("Invalid function call response");
    }

    const rawResult = JSON.parse(toolCall.function.arguments);
    
    // Log the raw result for debugging
    console.log("Raw astrology result:", JSON.stringify(rawResult, null, 2));
    
    // Validate with Zod schema
    try {
      const result = AstrologyAnalysisResultSchema.parse(rawResult);
    return result;
    } catch (validationError) {
      console.error("Astrology analysis validation failed:", validationError);
      console.error("Raw OpenAI response:", JSON.stringify(rawResult, null, 2));
      throw new Error("Invalid astrology analysis response format");
    }
  } catch (error) {
    console.error("OpenAI astrology analysis error:", error);
    throw new Error("Failed to analyze astrology chart: " + (error as Error).message);
  }
}

export async function generateChatResponse(
  userMessage: string,
  analysisType: string,
  analysisData: any,
  previousMessages: any[]
): Promise<string> {
  try {
    const contextPrompt = `You are an expert ${analysisType} consultant providing follow-up guidance based on a previous analysis. 
    
Previous analysis data: ${JSON.stringify(analysisData)}

Chat history:
${previousMessages.map(m => `${m.role}: ${m.content}`).join('\n')}

Provide helpful, insightful responses about the ${analysisType} analysis. Be specific, reference the previous analysis results, and offer practical guidance. Keep responses concise but meaningful.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: contextPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI chat response error:", error);
    throw new Error("Failed to generate chat response: " + (error as Error).message);
  }
}

export async function generateMysticalChatResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  try {
    const systemPrompt = `You are a wise and knowledgeable mystical assistant specializing in palmistry, astrology, numerology, tarot, Vastu Shastra, and spiritual guidance. You provide insightful, compassionate, and practical advice while maintaining a mystical yet grounded approach.

Your expertise includes:
- Palmistry: Understanding palm lines, mounts, and hand shapes
- Astrology: Vedic and Western astrology, birth charts, planetary influences
- Numerology: Life path numbers, destiny numbers, personal year cycles
- Tarot: Card meanings, spreads, intuitive interpretations
- Vastu Shastra: Space energy, directional influences, home harmony
- Spiritual Guidance: Meditation, chakras, energy healing, personal growth

Guidelines:
- Provide thoughtful, personalized responses based on traditional wisdom
- Be encouraging and positive while being honest about challenges
- Offer practical advice that can be applied to daily life
- Reference relevant mystical principles when appropriate
- Maintain a warm, supportive, and wise tone
- If asked about specific analysis results, help users understand and apply insights
- Encourage users to trust their intuition while providing guidance

Keep responses concise but meaningful, typically 2-4 paragraphs unless more detail is specifically requested.`;

    // Build the conversation context with proper typing
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content: systemPrompt
      },
      // Add conversation history with proper role typing
      ...conversationHistory.slice(-10).map(msg => ({
        role: (msg.role === "user" || msg.role === "assistant") ? msg.role as "user" | "assistant" : "user",
        content: msg.content
      })),
      {
        role: "user" as const,
        content: userMessage
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini as it supports vision and is widely available
      messages,
      max_completion_tokens: 800,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI mystical chat error:", error);
    throw new Error("Failed to generate mystical chat response: " + (error as Error).message);
  }
}

const vastuAnalysisFunction = {
  name: "analyze_vastu_layout",
  description: "Analyze a space layout for Vastu Shastra compliance and provide detailed recommendations for optimal energy flow and prosperity.",
  parameters: {
    type: "object",
    properties: {
      overallScore: {
        type: "number",
        description: "Overall Vastu compliance score (0-100)"
      },
      overallAssessment: {
        type: "string",
        description: "Comprehensive assessment of the space's Vastu compliance"
      },
      energyFlow: {
        type: "object",
        properties: {
          positive: {
            type: "array",
            items: { type: "string" },
            description: "Areas with positive energy flow"
          },
          negative: {
            type: "array",
            items: { type: "string" },
            description: "Areas with negative energy flow"
          },
          neutral: {
            type: "array",
            items: { type: "string" },
            description: "Areas with neutral energy flow"
          }
        },
        required: ["positive", "negative", "neutral"]
      },
      roomAnalysis: {
        type: "array",
        items: {
          type: "object",
          properties: {
            room: { type: "string" },
            direction: { type: "string" },
            vastuCompliance: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            score: { type: "number" }
          },
          required: ["room", "direction", "vastuCompliance", "recommendations", "score"]
        }
      },
      recommendations: {
        type: "object",
        properties: {
          immediate: {
            type: "array",
            items: { type: "string" },
            description: "Quick fixes that can be implemented immediately"
          },
          longTerm: {
            type: "array",
            items: { type: "string" },
            description: "Structural changes for better Vastu"
          },
          remedies: {
            type: "array",
            items: { type: "string" },
            description: "Vastu remedies using colors, elements, symbols"
          }
        },
        required: ["immediate", "longTerm", "remedies"]
      },
      prosperity: {
        type: "object",
        properties: {
          wealth: { type: "string" },
          health: { type: "string" },
          relationships: { type: "string" },
          career: { type: "string" }
        },
        required: ["wealth", "health", "relationships", "career"]
      }
    },
    required: ["overallScore", "overallAssessment", "energyFlow", "roomAnalysis", "recommendations", "prosperity"]
  }
};

export async function analyzeVastu(vastuData: VastuInput, base64Image?: string): Promise<VastuAnalysisResult> {
  try {
    const messages: any[] = [
      {
        role: "system",
        content: `You are an expert Vastu consultant with deep knowledge of Vastu Shastra principles. Analyze the provided layout information and provide detailed Vastu guidance. Focus on practical, implementable Vastu solutions while respecting traditional principles.`
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
      model: "gpt-4o-mini",
      messages,
      tools: [{ type: "function", function: vastuAnalysisFunction }],
      tool_choice: "auto",
      max_completion_tokens: 3000,
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || !('function' in toolCall) || toolCall.function.name !== "analyze_vastu_layout") {
      throw new Error("Invalid function call response");
    }

    const rawResult = JSON.parse(toolCall.function.arguments);
    
    // Validate with Zod schema
    try {
      const result = VastuAnalysisResultSchema.parse(rawResult);
    return result;
    } catch (validationError) {
      console.error("Vastu analysis validation failed:", validationError);
      console.error("Raw OpenAI response:", JSON.stringify(rawResult, null, 2));
      throw new Error("Invalid Vastu analysis response format");
    }
  } catch (error) {
    console.error("OpenAI Vastu analysis error:", error);
    throw new Error("Failed to analyze Vastu layout: " + (error as Error).message);
  }
}

const numerologyAnalysisFunction = {
  name: "analyze_numerology",
  description: "Calculate core numerology numbers and provide detailed insights about personality, life purpose, and future guidance using Pythagorean and Chaldean systems.",
  parameters: {
    type: "object",
    properties: {
      personalityOverview: {
        type: "string",
        description: "Comprehensive personality analysis based on numerological calculations"
      },
      coreNumbers: {
        type: "object",
        properties: {
          lifePathNumber: {
            type: "object",
            properties: {
              number: { type: "number" },
              meaning: { type: "string" },
              traits: { type: "array", items: { type: "string" } }
            },
            required: ["number", "meaning", "traits"]
          },
          destinyNumber: {
            type: "object",
            properties: {
              number: { type: "number" },
              meaning: { type: "string" },
              purpose: { type: "string" }
            },
            required: ["number", "meaning", "purpose"]
          },
          soulUrgeNumber: {
            type: "object",
            properties: {
              number: { type: "number" },
              meaning: { type: "string" },
              desires: { type: "string" }
            },
            required: ["number", "meaning", "desires"]
          },
          personalityNumber: {
            type: "object",
            properties: {
              number: { type: "number" },
              meaning: { type: "string" },
              impression: { type: "string" }
            },
            required: ["number", "meaning", "impression"]
          }
        },
        required: ["lifePathNumber", "destinyNumber", "soulUrgeNumber", "personalityNumber"]
      },
      lifeAreas: {
        type: "object",
        properties: {
          strengths: { type: "array", items: { type: "string" } },
          challenges: { type: "array", items: { type: "string" } },
          careerPath: { type: "string" },
          relationships: { type: "string" },
          luckyNumbers: { type: "array", items: { type: "number" } },
          favorableColors: { type: "array", items: { type: "string" } }
        },
        required: ["strengths", "challenges", "careerPath", "relationships", "luckyNumbers", "favorableColors"]
      },
      predictions: {
        type: "object",
        properties: {
          currentYear: { type: "string" },
          nextPhase: { type: "string" },
          opportunities: { type: "array", items: { type: "string" } }
        },
        required: ["currentYear", "nextPhase", "opportunities"]
      }
    },
    required: ["personalityOverview", "coreNumbers", "lifeAreas", "predictions"]
  }
};

export async function analyzeNumerology(numerologyData: NumerologyInput): Promise<NumerologyAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert numerologist with deep knowledge of Pythagorean and Chaldean numerology systems. Analyze the provided information and calculate core numbers with detailed insights. Calculate numbers using traditional numerological methods. For Life Path, reduce birth date to single digit. For Destiny/Expression, use full birth name. For Soul Urge, use vowels in name. For Personality, use consonants in name. Provide positive, empowering insights while being specific and actionable.`
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
      tools: [{ type: "function", function: numerologyAnalysisFunction }],
      tool_choice: "auto",
      max_completion_tokens: 3000,
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || !('function' in toolCall) || toolCall.function.name !== "analyze_numerology") {
      throw new Error("Invalid function call response");
    }

    const rawResult = JSON.parse(toolCall.function.arguments);
    
    // Validate with Zod schema
    try {
      const result = NumerologyAnalysisResultSchema.parse(rawResult);
    return result;
    } catch (validationError) {
      console.error("Numerology analysis validation failed:", validationError);
      console.error("Raw OpenAI response:", JSON.stringify(rawResult, null, 2));
      throw new Error("Invalid numerology analysis response format");
    }
  } catch (error) {
    console.error("OpenAI numerology analysis error:", error);
    throw new Error("Failed to analyze numerology: " + (error as Error).message);
  }
}

const tarotAnalysisFunction = {
  name: "analyze_tarot_reading",
  description: "Interpret a tarot card spread and provide comprehensive guidance including card meanings, overall message, and practical advice.",
  parameters: {
    type: "object",
    properties: {
      spreadType: {
        type: "string",
        description: "The type of spread used"
      },
      personalityOverview: {
        type: "string",
        description: "Personality insights based on the overall card energy and spread"
      },
      cardAnalysis: {
        type: "array",
        items: {
          type: "object",
          properties: {
            position: { type: "string" },
            cardName: { type: "string" },
            meaning: { type: "string" },
            interpretation: { type: "string" },
            reversed: { type: "boolean" },
            reversedMeaning: { type: "string" }
          },
          required: ["position", "cardName", "meaning", "interpretation", "reversed"]
        }
      },
      overallMessage: {
        type: "string",
        description: "The main message from the reading"
      },
      guidance: {
        type: "object",
        properties: {
          pastInfluences: { type: "string" },
          presentSituation: { type: "string" },
          futureOutlook: { type: "string" },
          advice: { type: "string" },
          outcome: { type: "string" }
        },
        required: ["presentSituation", "advice"]
      },
      actionSteps: {
        type: "array",
        items: { type: "string" },
        description: "Practical action steps based on the reading"
      },
      reflection: {
        type: "string",
        description: "Deep reflection and spiritual insights from the reading"
      }
    },
    required: ["spreadType", "personalityOverview", "cardAnalysis", "overallMessage", "guidance", "actionSteps", "reflection"]
  }
};

export async function analyzeTarot(tarotData: TarotInput): Promise<TarotAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert tarot reader with decades of experience in card interpretation and divination. Analyze the provided tarot spread and cards to give meaningful, insightful guidance. Focus on traditional tarot meanings while providing personalized, empowering guidance. Be specific about how each card relates to its position in the spread. Consider reversed cards as offering different perspectives, not necessarily negative meanings. Provide practical, actionable advice while honoring the mystical nature of tarot.`
        },
        {
          role: "user",
          content: `Please interpret this tarot reading:
          
Spread Type: ${tarotData.spreadType}
${tarotData.question ? `Question: ${tarotData.question}` : 'General guidance reading'}

Cards Drawn:
${tarotData.drawnCards.map((card, index) => 
  `${index + 1}. Position: ${card.position}
     Card: ${card.cardName}${card.suit ? ` (${card.suit})` : ''}
     ${card.reversed ? 'REVERSED' : 'UPRIGHT'}`
).join('\n\n')}

Provide a comprehensive tarot interpretation with deep insights, practical guidance, and spiritual wisdom. Consider the relationships between the cards and how they speak to each other within the spread. Offer empowering advice that helps the querent understand their situation and potential paths forward.`
        },
      ],
      tools: [{ type: "function", function: tarotAnalysisFunction }],
      tool_choice: "auto",
      max_completion_tokens: 4000,
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall || !('function' in toolCall) || toolCall.function.name !== "analyze_tarot_reading") {
      throw new Error("Invalid function call response");
    }

    const rawResult = JSON.parse(toolCall.function.arguments);
    
    // Validate with Zod schema
    try {
      const result = TarotAnalysisResultSchema.parse(rawResult);
    return result;
    } catch (validationError) {
      console.error("Tarot analysis validation failed:", validationError);
      console.error("Raw OpenAI response:", JSON.stringify(rawResult, null, 2));
      throw new Error("Invalid tarot analysis response format");
    }
  } catch (error) {
    console.error("OpenAI tarot analysis error:", error);
    throw new Error("Failed to analyze tarot reading: " + (error as Error).message);
  }
}
