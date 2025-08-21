import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const palmAnalyses = pgTable("palm_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  analysisResult: jsonb("analysis_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analysisResultSchema = z.object({
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

export const insertPalmAnalysisSchema = createInsertSchema(palmAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertPalmAnalysis = z.infer<typeof insertPalmAnalysisSchema>;
export type PalmAnalysis = typeof palmAnalyses.$inferSelect;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
