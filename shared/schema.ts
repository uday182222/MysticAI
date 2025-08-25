import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Generic analyses table for all analysis types
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'palm', 'astrology', 'vastu'
  imageUrl: text("image_url"), // Optional for astrology
  inputData: jsonb("input_data").notNull(), // Birth info for astrology, layout data for vastu
  analysisResult: jsonb("analysis_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  personalityOverview: z.string(),
  traits: z.array(z.string()),
  lifeEnergyPercentage: z.number(),
  emotionalBalancePercentage: z.number(),
  careerPotentialPercentage: z.number(),
  loveAndRelationships: z.object({
    heartLineAnalysis: z.string(),
    compatibilityInsights: z.string(),
    relationshipStrength: z.string(),
  }),
  careerAndSuccess: z.object({
    professionalStrengths: z.string(),
    recommendedPaths: z.array(z.string()),
    successPotential: z.string(),
  }),
  healthAndWellness: z.object({
    lifeLineInsights: z.string(),
    wellnessRecommendations: z.array(z.string()),
    vitalityLevel: z.string(),
  }),
  futureInsights: z.object({
    nearFuture: z.string(),
    lifePathDirection: z.string(),
    pathClarity: z.string(),
  }),
  palmLines: z.object({
    heartLine: z.string(),
    headLine: z.string(),
    lifeLine: z.string(),
    fateLine: z.string(),
  }),
});

// Astrology analysis schemas
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

// Generic analysis schema
export const analysisInputSchema = z.object({
  type: z.enum(['palm', 'astrology', 'vastu']),
  imageUrl: z.string().optional(),
  inputData: z.union([astrologyInputSchema, vastuInputSchema, z.object({})]),
});

export const analysisResultSchema = z.union([
  palmAnalysisResultSchema,
  astrologyAnalysisResultSchema,
  vastuAnalysisResultSchema,
]);

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export const insertPalmAnalysisSchema = createInsertSchema(palmAnalyses).omit({
  id: true,
  createdAt: true,
});

// Types
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type InsertPalmAnalysis = z.infer<typeof insertPalmAnalysisSchema>;
export type PalmAnalysis = typeof palmAnalyses.$inferSelect;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type PalmAnalysisResult = z.infer<typeof palmAnalysisResultSchema>;
export type AstrologyInput = z.infer<typeof astrologyInputSchema>;
export type AstrologyAnalysisResult = z.infer<typeof astrologyAnalysisResultSchema>;
export type VastuInput = z.infer<typeof vastuInputSchema>;
export type VastuAnalysisResult = z.infer<typeof vastuAnalysisResultSchema>;
