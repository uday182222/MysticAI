import { type PalmAnalysis, type InsertPalmAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createPalmAnalysis(analysis: InsertPalmAnalysis): Promise<PalmAnalysis>;
  getPalmAnalysis(id: string): Promise<PalmAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private palmAnalyses: Map<string, PalmAnalysis>;

  constructor() {
    this.palmAnalyses = new Map();
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
}

export const storage = new MemStorage();
