import { type PalmAnalysis, type InsertPalmAnalysis, type Analysis, type InsertAnalysis, palmAnalyses, analyses } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createPalmAnalysis(analysis: InsertPalmAnalysis): Promise<PalmAnalysis>;
  getPalmAnalysis(id: string): Promise<PalmAnalysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createPalmAnalysis(insertAnalysis: InsertPalmAnalysis): Promise<PalmAnalysis> {
    const [analysis] = await db
      .insert(palmAnalyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getPalmAnalysis(id: string): Promise<PalmAnalysis | undefined> {
    const [analysis] = await db.select().from(palmAnalyses).where(eq(palmAnalyses.id, id));
    return analysis || undefined;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis || undefined;
  }
}

export const storage = new DatabaseStorage();
