import { type PalmAnalysis, type InsertPalmAnalysis, type Analysis, type InsertAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createPalmAnalysis(analysis: InsertPalmAnalysis): Promise<PalmAnalysis>;
  getPalmAnalysis(id: string): Promise<PalmAnalysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
}

export class MemStorage implements IStorage {
  private palmAnalyses: Map<string, PalmAnalysis>;
  private analyses: Map<string, Analysis>;

  constructor() {
    this.palmAnalyses = new Map();
    this.analyses = new Map();
  }

  async createPalmAnalysis(insertAnalysis: InsertPalmAnalysis): Promise<PalmAnalysis> {
    const id = randomUUID();
    const analysis: PalmAnalysis = { 
      ...insertAnalysis, 
      id,
      createdAt: new Date()
    };
    this.palmAnalyses.set(id, analysis);
    return analysis;
  }

  async getPalmAnalysis(id: string): Promise<PalmAnalysis | undefined> {
    return this.palmAnalyses.get(id);
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = { 
      ...insertAnalysis, 
      id,
      imageUrl: insertAnalysis.imageUrl ?? null,
      createdAt: new Date()
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getAnalysis(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }
}

export const storage = new MemStorage();
