import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session table for express-session storage
export const session = sqliteTable("session", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: integer("expire").notNull(),
});

// Users table for authentication and account management
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  credits: integer("credits").default(0).notNull(), // Question credits (for post-analysis chat)
  aiChatCredits: integer("ai_chat_credits").default(0).notNull(), // AI chat time credits
  aiChatMinutesUsed: integer("ai_chat_minutes_used").default(0).notNull(), // Track usage
  isActive: integer("is_active").default(1).notNull(),
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
  updatedAt: integer("updated_at").default(sql`unixepoch()`).notNull(),
});

// Generic analyses table for all analysis types (now supports 5 types)
export const analyses = sqliteTable("analyses", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // Link to user account
  type: text("type").notNull(), // 'palm', 'astrology', 'vastu', 'numerology', 'tarot'
  imageUrl: text("image_url"), // Optional for astrology, numerology
  inputData: text("input_data").notNull(), // Birth info, layout data, numerology inputs, etc.
  analysisResult: text("analysis_result").notNull(),
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
});

// Chat conversations linked to specific analyses
export const chatConversations = sqliteTable("chat_conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  analysisId: text("analysis_id").notNull().references(() => analyses.id),
  questionsUsed: integer("questions_used").default(0).notNull(),
  questionsLimit: integer("questions_limit").default(5).notNull(),
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
  updatedAt: integer("updated_at").default(sql`unixepoch()`).notNull(),
});

// Individual chat messages in conversations
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => chatConversations.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
});

// AI chat sessions for credit-based general AI chat (separate from post-analysis chat)
export const aiChatSessions = sqliteTable("ai_chat_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  minutesUsed: real("minutes_used").default(0).notNull(),
  creditsUsed: integer("credits_used").default(0).notNull(),
  status: text("status").notNull(), // 'active', 'completed', 'expired'
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
  updatedAt: integer("updated_at").default(sql`unixepoch()`).notNull(),
});

// AI chat messages for general chat sessions
export const aiChatMessages = sqliteTable("ai_chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => aiChatSessions.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
});

// Payment records for credit purchases
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  razorpayPaymentId: text("razorpay_payment_id").unique(),
  razorpayOrderId: text("razorpay_order_id"),
  amount: real("amount").notNull(), // Amount in USD
  creditsGranted: integer("credits_granted").notNull(), // AI chat credits (5, 10, or 15)
  minutesGranted: integer("minutes_granted").notNull(), // Chat minutes (5, 10, or 15)
  paymentTier: text("payment_tier").notNull(), // 'tier1', 'tier2', 'tier3'
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
  completedAt: integer("completed_at"),
});

// Keep legacy table for backward compatibility
export const palmAnalyses = sqliteTable("palm_analyses", {
  id: text("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  analysisResult: text("analysis_result").notNull(),
  createdAt: integer("created_at").default(sql`unixepoch()`).notNull(),
});

// Palm analysis result schema
export const palmAnalysisResultSchema = z.object({
  personalityOverview: z.string().optional(),
  traits: z.array(z.string()).optional(),
  lifeEnergyPercentage: z.number().optional(),
  emotionalBalancePercentage: z.number().optional(),
  careerPotentialPercentage: z.number().optional(),
  loveAndRelationships: z.object({
    heartLineAnalysis: z.string().optional(),
    compatibilityInsights: z.string().optional(),
    relationshipStrength: z.string().optional(),
  }).optional(),
  careerAndSuccess: z.object({
    professionalStrengths: z.string().optional(),
    recommendedPaths: z.array(z.string()).optional(),
    successPotential: z.string().optional(),
  }).optional(),
  healthAndWellness: z.object({
    lifeLineInsights: z.string().optional(),
    wellnessRecommendations: z.array(z.string()).optional(),
    vitalityLevel: z.string().optional(),
  }).optional(),
  futureInsights: z.object({
    nearFuture: z.string().optional(),
    lifePathDirection: z.string().optional(),
    pathClarity: z.string().optional(),
  }).optional(),
  palmLines: z.object({
    heartLine: z.string().optional(),
    headLine: z.string().optional(),
    lifeLine: z.string().optional(),
    fateLine: z.string().optional(),
  }).optional(),
}).passthrough();

// Astrology analysis schemas (enhanced with Kundli chart data)
export const astrologyInputSchema = z.object({
  birthDate: z.string(),
  birthTime: z.string(),
  birthPlace: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const astrologyAnalysisResultSchema = z.object({
  personalityOverview: z.string(),
  sunSign: z.string(),
  moonSign: z.string(),
  risingSign: z.string(),
  // Enhanced Kundli chart data
  kundliChart: z.object({
    houses: z.array(z.object({
      number: z.number(),
      sign: z.string(),
      planets: z.array(z.string()),
      ruling: z.string(),
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
      ketu: z.object({ sign: z.string(), house: z.number(), degrees: z.number() }),
    }),
    aspects: z.array(z.object({
      from: z.string(),
      to: z.string(),
      type: z.string(),
      influence: z.string(),
    })),
  }),
  planetaryPositions: z.object({
    sun: z.string(),
    moon: z.string(),
    mercury: z.string(),
    venus: z.string(),
    mars: z.string(),
    jupiter: z.string(),
    saturn: z.string(),
  }).optional(),
  lifeAreas: z.object({
    loveAndRelationships: z.object({
      overview: z.string(),
      compatibility: z.string(),
      romanticTendencies: z.string(),
    }),
    careerAndFinances: z.object({
      careerPath: z.string(),
      financialLuck: z.string(),
      professionalStrengths: z.array(z.string()),
    }),
    healthAndWellbeing: z.object({
      physicalHealth: z.string(),
      mentalHealth: z.string(),
      recommendations: z.array(z.string()),
    }),
    spiritualGrowth: z.object({
      lifeLesson: z.string(),
      spiritualPath: z.string(),
      karmaInsights: z.string(),
    }),
  }),
  predictions: z.object({
    thisYear: z.string(),
    nextThreeYears: z.string(),
    majorLifeEvents: z.array(z.string()),
  }).optional(),
});

// Numerology analysis schemas
export const numerologyInputSchema = z.object({
  name: z.string().optional(),
  birthDate: z.string().optional(),
  companyName: z.string().optional(),
  analysisType: z.enum(['personal', 'business']),
});

export const numerologyAnalysisResultSchema = z.object({
  personalityOverview: z.string(),
  coreNumbers: z.object({
    lifePathNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      traits: z.array(z.string()),
    }),
    destinyNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      purpose: z.string(),
    }),
    soulUrgeNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      desires: z.string(),
    }),
    personalityNumber: z.object({
      number: z.number(),
      meaning: z.string(),
      impression: z.string(),
    }),
  }),
  lifeAreas: z.object({
    strengths: z.array(z.string()),
    challenges: z.array(z.string()),
    careerPath: z.string(),
    relationships: z.string(),
    luckyNumbers: z.array(z.number()),
    favorableColors: z.array(z.string()),
  }),
  predictions: z.object({
    currentYear: z.string(),
    nextPhase: z.string(),
    opportunities: z.array(z.string()),
  }),
});

// Tarot analysis schemas
export const tarotInputSchema = z.object({
  spreadType: z.enum(['three-card', 'celtic-cross', 'single-card']),
  question: z.string().optional(),
  drawnCards: z.array(z.object({
    cardName: z.string(),
    suit: z.string().optional(),
    position: z.string(),
    reversed: z.boolean(),
  })),
});

export const tarotAnalysisResultSchema = z.object({
  spreadType: z.string(),
  personalityOverview: z.string(),
  cardAnalysis: z.array(z.object({
    position: z.string(),
    cardName: z.string(),
    meaning: z.string(),
    interpretation: z.string(),
    reversed: z.boolean(),
    reversedMeaning: z.string().optional(),
  })),
  overallMessage: z.string(),
  guidance: z.object({
    pastInfluences: z.string().optional(),
    presentSituation: z.string(),
    futureOutlook: z.string().optional(),
    advice: z.string(),
    outcome: z.string().optional(),
  }),
  actionSteps: z.array(z.string()),
  reflection: z.string(),
});

// Vastu analysis schemas
export const vastuInputSchema = z.object({
  layoutType: z.string(), // 'home', 'office', 'shop'
  rooms: z.array(z.object({
    name: z.string(),
    direction: z.string(),
    size: z.string(),
  })),
  entrance: z.string(),
  buildingShape: z.string(),
  surroundings: z.string(),
});

export const vastuAnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  overallAssessment: z.string(),
  energyFlow: z.object({
    positive: z.array(z.string()),
    negative: z.array(z.string()),
    neutral: z.array(z.string()),
  }),
  roomAnalysis: z.array(z.object({
    room: z.string(),
    direction: z.string(),
    vastuCompliance: z.string(),
    recommendations: z.array(z.string()),
    score: z.number().min(0).max(100),
  })),
  recommendations: z.object({
    immediate: z.array(z.string()),
    longTerm: z.array(z.string()),
    remedies: z.array(z.string()),
  }),
  prosperity: z.object({
    wealth: z.string(),
    health: z.string(),
    relationships: z.string(),
    career: z.string(),
  }),
}).passthrough(); // Allow additional fields

// User authentication schemas
export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Chat message schemas
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

// Payment schemas
export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  creditsRequested: z.number().positive(),
  paymentTier: z.enum(['tier1', 'tier2', 'tier3']),
});

// AI chat schemas
export const aiChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export const createAiChatSessionSchema = z.object({
  userId: z.string(),
});

// Generic analysis schema (updated for 5 types)
export const analysisInputSchema = z.object({
  type: z.enum(['palm', 'astrology', 'vastu', 'numerology', 'tarot']),
  imageUrl: z.string().optional(),
  inputData: z.union([
    astrologyInputSchema, 
    vastuInputSchema, 
    numerologyInputSchema,
    tarotInputSchema,
    z.object({})
  ]),
});

export const analysisResultSchema = z.union([
  palmAnalysisResultSchema,
  astrologyAnalysisResultSchema,
  vastuAnalysisResultSchema,
  numerologyAnalysisResultSchema,
  tarotAnalysisResultSchema,
]);

// Insert schemas
export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export const insertPalmAnalysisSchema = createInsertSchema(palmAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertAiChatSessionSchema = createInsertSchema(aiChatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiChatMessageSchema = createInsertSchema(aiChatMessages).omit({
  id: true,
  createdAt: true,
});

// Types for all entities
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export type PalmAnalysis = typeof palmAnalyses.$inferSelect;
export type InsertPalmAnalysis = z.infer<typeof insertPalmAnalysisSchema>;
export type PalmAnalysisResult = z.infer<typeof palmAnalysisResultSchema>;

export type AstrologyInput = z.infer<typeof astrologyInputSchema>;
export type AstrologyAnalysisResult = z.infer<typeof astrologyAnalysisResultSchema>;

export type VastuInput = z.infer<typeof vastuInputSchema>;
export type VastuAnalysisResult = z.infer<typeof vastuAnalysisResultSchema>;

export type NumerologyInput = z.infer<typeof numerologyInputSchema>;
export type NumerologyAnalysisResult = z.infer<typeof numerologyAnalysisResultSchema>;

export type TarotInput = z.infer<typeof tarotInputSchema>;
export type TarotAnalysisResult = z.infer<typeof tarotAnalysisResultSchema>;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type CreatePayment = z.infer<typeof createPaymentSchema>;

export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type InsertAiChatSession = z.infer<typeof insertAiChatSessionSchema>;
export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = z.infer<typeof insertAiChatMessageSchema>;
