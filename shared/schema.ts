import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session table for express-session storage
export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Users table for authentication and account management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  hashedPassword: varchar("hashed_password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  credits: integer("credits").default(0).notNull(), // Question credits
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Generic analyses table for all analysis types (now supports 5 types)
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Link to user account
  type: varchar("type").notNull(), // 'palm', 'astrology', 'vastu', 'numerology', 'tarot'
  imageUrl: text("image_url"), // Optional for astrology, numerology
  inputData: jsonb("input_data").notNull(), // Birth info, layout data, numerology inputs, etc.
  analysisResult: jsonb("analysis_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat conversations linked to specific analyses
export const chatConversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  analysisId: varchar("analysis_id").notNull().references(() => analyses.id),
  questionsUsed: integer("questions_used").default(0).notNull(),
  questionsLimit: integer("questions_limit").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Individual chat messages in conversations
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => chatConversations.id),
  role: varchar("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payment records for credit purchases
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // $1.00
  creditsGranted: integer("credits_granted").notNull(), // 5 questions per $1
  status: varchar("status").notNull(), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Keep legacy table for backward compatibility
export const palmAnalyses = pgTable("palm_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  analysisResult: jsonb("analysis_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  }),
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
  }),
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
  overallScore: z.number(),
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
    score: z.number(),
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
});

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
