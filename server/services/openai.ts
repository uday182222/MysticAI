import OpenAI from "openai";
import { AstrologyInput, VastuInput, NumerologyInput, TarotInput } from "@shared/schema";

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
          content: `You are an expert Vedic astrologer with decades of experience in Jyotish and birth chart analysis. Analyze the provided birth information and create a comprehensive Kundli (birth chart) reading. Return your analysis in JSON format with the following structure:

{
  "personalityOverview": "Detailed personality analysis based on birth chart",
  "sunSign": "Sun sign with detailed characteristics",
  "moonSign": "Moon sign with emotional patterns", 
  "risingSign": "Rising sign (Lagna) with outward personality traits",
  "kundliChart": {
    "houses": [
      {
        "number": 1,
        "sign": "Aries",
        "planets": ["Sun", "Mercury"],
        "ruling": "Mars"
      }
    ],
    "planetaryPositions": {
      "sun": {"sign": "Leo", "house": 5, "degrees": 15.30},
      "moon": {"sign": "Cancer", "house": 4, "degrees": 22.45},
      "mercury": {"sign": "Virgo", "house": 6, "degrees": 8.15},
      "venus": {"sign": "Libra", "house": 7, "degrees": 12.20},
      "mars": {"sign": "Scorpio", "house": 8, "degrees": 25.10},
      "jupiter": {"sign": "Sagittarius", "house": 9, "degrees": 18.55},
      "saturn": {"sign": "Capricorn", "house": 10, "degrees": 3.40},
      "rahu": {"sign": "Gemini", "house": 3, "degrees": 14.25},
      "ketu": {"sign": "Sagittarius", "house": 9, "degrees": 14.25}
    },
    "aspects": [
      {
        "from": "Jupiter",
        "to": "Sun", 
        "type": "Trine",
        "influence": "Positive influence bringing wisdom and expansion"
      }
    ]
  },
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
      model: "gpt-4o",
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
      model: "gpt-4o", // Using gpt-4o as it's the most reliable model available
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

export async function analyzeTarot(tarotData: TarotInput): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert tarot reader with decades of experience in card interpretation and divination. Analyze the provided tarot spread and cards to give meaningful, insightful guidance. Return your analysis in JSON format with the following structure:

{
  "spreadType": "The type of spread used",
  "personalityOverview": "Personality insights based on the overall card energy and spread",
  "cardAnalysis": [
    {
      "position": "Position name in the spread",
      "cardName": "Name of the card",
      "meaning": "Traditional meaning of the card",
      "interpretation": "Specific interpretation for this position and question",
      "reversed": false,
      "reversedMeaning": "Meaning when reversed (if applicable)"
    }
  ],
  "overallMessage": "The main message from the reading",
  "guidance": {
    "pastInfluences": "Past influences affecting the situation",
    "presentSituation": "Current situation analysis",
    "futureOutlook": "Future potential and trends",
    "advice": "Practical advice and guidance",
    "outcome": "Potential outcome if current path continues"
  },
  "actionSteps": ["step1", "step2", "step3"],
  "reflection": "Deep reflection and spiritual insights from the reading"
}

Focus on traditional tarot meanings while providing personalized, empowering guidance. Be specific about how each card relates to its position in the spread. Consider reversed cards as offering different perspectives, not necessarily negative meanings. Provide practical, actionable advice while honoring the mystical nature of tarot.`
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
      response_format: { type: "json_object" },
      max_completion_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("OpenAI tarot analysis error:", error);
    throw new Error("Failed to analyze tarot reading: " + (error as Error).message);
  }
}
