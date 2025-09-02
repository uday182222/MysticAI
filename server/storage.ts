import { 
  type PalmAnalysis, 
  type InsertPalmAnalysis, 
  type Analysis, 
  type InsertAnalysis, 
  type User,
  type InsertUser,
  type ChatConversation,
  type InsertChatConversation,
  type ChatMessage,
  type InsertChatMessage,
  type Payment,
  type InsertPayment,
  type AiChatSession,
  type InsertAiChatSession,
  type AiChatMessage,
  type InsertAiChatMessage,
  palmAnalyses, 
  analyses,
  users,
  chatConversations,
  chatMessages,
  payments,
  aiChatSessions,
  aiChatMessages
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Palm analysis methods
  createPalmAnalysis(analysis: InsertPalmAnalysis): Promise<PalmAnalysis>;
  getPalmAnalysis(id: string): Promise<PalmAnalysis | undefined>;
  
  // General analysis methods  
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: string): Promise<Analysis | undefined>;
  
  // User authentication methods
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUserCredits(userId: string, credits: number): Promise<User>;
  updateUserAiChatCredits(userId: string, aiChatCredits: number, aiChatMinutesUsed: number): Promise<User>;
  
  // Chat methods (post-analysis)
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversationByAnalysis(analysisId: string, userId: string): Promise<ChatConversation | undefined>;
  updateConversationQuestions(conversationId: string, questionsUsed: number): Promise<ChatConversation>;
  
  // Chat message methods (post-analysis)
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByConversation(conversationId: string): Promise<ChatMessage[]>;
  
  // AI Chat methods (credit-based general chat)
  createAiChatSession(session: InsertAiChatSession): Promise<AiChatSession>;
  getActiveAiChatSession(userId: string): Promise<AiChatSession | undefined>;
  updateAiChatSessionUsage(sessionId: string, minutesUsed: number, creditsUsed: number): Promise<AiChatSession>;
  
  // AI Chat message methods
  createAiChatMessage(message: InsertAiChatMessage): Promise<AiChatMessage>;
  getAiChatMessagesBySession(sessionId: string): Promise<AiChatMessage[]>;
  
  // User methods
  getUser(id: string): Promise<User | undefined>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(paymentId: string, status: string, razorpayPaymentId?: string, completedAt?: Date): Promise<Payment>;
}

export class DatabaseStorage implements IStorage {
  // Palm analysis methods
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

  // General analysis methods
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

  // User authentication methods
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async updateUserCredits(userId: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserAiChatCredits(userId: string, aiChatCredits: number, aiChatMinutesUsed: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ aiChatCredits, aiChatMinutesUsed, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Chat methods
  async createChatConversation(insertConversation: InsertChatConversation): Promise<ChatConversation> {
    const [conversation] = await db
      .insert(chatConversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getChatConversationByAnalysis(analysisId: string, userId: string): Promise<ChatConversation | undefined> {
    const [conversation] = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.analysisId, analysisId));
    return conversation || undefined;
  }

  async updateConversationQuestions(conversationId: string, questionsUsed: number): Promise<ChatConversation> {
    const [conversation] = await db
      .update(chatConversations)
      .set({ questionsUsed, updatedAt: new Date() })
      .where(eq(chatConversations.id, conversationId))
      .returning();
    return conversation;
  }

  // Chat message methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getChatMessagesByConversation(conversationId: string): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
    return messages;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.getUserById(id);
  }

  // Payment methods
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async updatePaymentStatus(paymentId: string, status: string, razorpayPaymentId?: string, completedAt?: Date): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set({ 
        status, 
        ...(razorpayPaymentId && { razorpayPaymentId }),
        ...(completedAt && { completedAt })
      })
      .where(eq(payments.id, paymentId))
      .returning();
    return payment;
  }

  // AI Chat methods
  async createAiChatSession(insertSession: InsertAiChatSession): Promise<AiChatSession> {
    const [session] = await db
      .insert(aiChatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getActiveAiChatSession(userId: string): Promise<AiChatSession | undefined> {
    const [session] = await db
      .select()
      .from(aiChatSessions)
      .where(eq(aiChatSessions.userId, userId))
      .orderBy(aiChatSessions.createdAt); // Get most recent
    return session || undefined;
  }

  async updateAiChatSessionUsage(sessionId: string, minutesUsed: number, creditsUsed: number): Promise<AiChatSession> {
    const [session] = await db
      .update(aiChatSessions)
      .set({ minutesUsed, creditsUsed, updatedAt: new Date() })
      .where(eq(aiChatSessions.id, sessionId))
      .returning();
    return session;
  }

  // AI Chat message methods
  async createAiChatMessage(insertMessage: InsertAiChatMessage): Promise<AiChatMessage> {
    const [message] = await db
      .insert(aiChatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getAiChatMessagesBySession(sessionId: string): Promise<AiChatMessage[]> {
    const messages = await db
      .select()
      .from(aiChatMessages)
      .where(eq(aiChatMessages.sessionId, sessionId))
      .orderBy(aiChatMessages.createdAt);
    return messages;
  }
}

export const storage = new DatabaseStorage();
