import type { Express } from "express";
import { createServer, type Server } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { 
  insertPalmAnalysisSchema, 
  palmAnalysisResultSchema, 
  astrologyInputSchema, 
  astrologyAnalysisResultSchema,
  vastuInputSchema,
  vastuAnalysisResultSchema,
  numerologyInputSchema,
  numerologyAnalysisResultSchema,
  tarotInputSchema,
  tarotAnalysisResultSchema,
  insertAnalysisSchema,
  userRegistrationSchema,
  userLoginSchema
} from "@shared/schema";
import * as sqliteSchema from "@shared/schema-sqlite";

// Use SQLite schema in development, PostgreSQL in production
const isDevelopment = process.env.NODE_ENV === 'development';
const useSQLite = isDevelopment && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sqlite'));

const schemas = useSQLite ? sqliteSchema : {
  insertPalmAnalysisSchema, 
  palmAnalysisResultSchema, 
  astrologyInputSchema, 
  astrologyAnalysisResultSchema,
  vastuInputSchema,
  vastuAnalysisResultSchema,
  numerologyInputSchema,
  numerologyAnalysisResultSchema,
  tarotInputSchema,
  tarotAnalysisResultSchema,
  insertAnalysisSchema,
  userRegistrationSchema,
  userLoginSchema
};
import { analyzePalmImage, analyzeAstrologyChart, analyzeVastu, analyzeNumerology, analyzeTarot, generateChatResponse, generateMysticalChatResponse } from "./services/openai";
import { createRazorpayOrder, verifyRazorpaySignature, PAYMENT_TIERS } from "./services/razorpay";
import multer from "multer";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  console.log("Auth middleware - session userId:", req.session?.userId);
  
  if (!req.session.userId) {
    console.log("No session userId found");
    return res.status(401).json({ message: "Authentication required" });
  }
  
  // Fetch and attach user object
  storage.getUserById(req.session.userId)
    .then(user => {
      console.log("Auth middleware - user found:", user ? "Yes" : "No");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      console.log("Auth middleware - req.user set:", req.user?.id);
      next();
    })
    .catch(error => {
      console.error("Auth middleware error:", error);
      return res.status(500).json({ message: "Authentication error" });
    });
}

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const isDevelopment = process.env.NODE_ENV === 'development';
  const useSQLite = isDevelopment && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sqlite'));
  
  app.use(session({
    store: useSQLite ? undefined : new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'mystic-read-ai-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // User registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = schemas.userRegistrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        email: userData.email,
        hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        credits: 0
      });

      // Start session
      (req.session as any).userId = user.id;
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
        aiChatCredits: user.aiChatCredits,
        aiChatMinutesUsed: user.aiChatMinutesUsed
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Registration failed" 
      });
    }
  });

  // User login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = schemas.userLoginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(loginData.email);
      if (!user || !user.hashedPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(loginData.password, user.hashedPassword);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Start session
      (req.session as any).userId = user.id;
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
        aiChatCredits: user.aiChatCredits,
        aiChatMinutesUsed: user.aiChatMinutesUsed
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Login failed" 
      });
    }
  });

  // User logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        credits: user.credits,
        aiChatCredits: user.aiChatCredits,
        aiChatMinutesUsed: user.aiChatMinutesUsed
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get user" 
      });
    }
  });

  // Analyze palm image endpoint
  app.post("/api/palm/analyze", requireAuth, upload.single('palmImage'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Analyze palm using OpenAI
      const analysisResult = await analyzePalmImage(base64Image);
      
      // Log the raw response to debug schema mismatch
      console.log("Raw GPT-5 Response:", JSON.stringify(analysisResult, null, 2));
      
      // Validate the analysis result
      const validatedResult = schemas.palmAnalysisResultSchema.parse(analysisResult);
      
      // Store the analysis in main analyses table for chat compatibility
      console.log("Palm analysis - req.user:", req.user);
      console.log("Palm analysis - req.user.id:", req.user?.id);
      
      if (!req.user || !req.user.id) {
        throw new Error("User not authenticated properly");
      }
      
      // Try to store the analysis, but don't fail if it doesn't work
      let analysisId: string = randomUUID();
      try {
        const analysis = await storage.createAnalysis({
          userId: req.user.id,
          type: "palm",
          imageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
          inputData: JSON.stringify({ imageUrl: `data:${req.file.mimetype};base64,${base64Image}` }),
          analysisResult: JSON.stringify(validatedResult),
        });
        analysisId = analysis.id;
        console.log("Analysis stored successfully with ID:", analysisId);
      } catch (dbError) {
        console.error("Failed to store analysis in database:", dbError);
        // Continue anyway - return the result to the user
      }

      res.json({
        id: analysisId,
        result: validatedResult,
        imageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
      });
    } catch (error) {
      console.error("Palm analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze palm image" 
      });
    }
  });

  // Get palm analysis by ID
  app.get("/api/palm/:id", async (req, res) => {
    try {
      const analysis = await storage.getPalmAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  // Analyze astrology chart endpoint
  app.post("/api/astrology/analyze", async (req, res) => {
    try {
      const astrologyData = schemas.astrologyInputSchema.parse(req.body);
      
      // Analyze astrology chart using OpenAI
      const analysisResult = await analyzeAstrologyChart(astrologyData);
      
      // Validate the analysis result
      const validatedResult = astrologyAnalysisResultSchema.parse(analysisResult);
      
      // For now, return analysis without storing in database
      // TODO: Add proper user authentication and storage
      const analysisId = `astrology_${Date.now()}`;

      res.json({
        id: analysisId,
        result: validatedResult,
        inputData: astrologyData,
      });
    } catch (error) {
      console.error("Astrology analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze astrology chart" 
      });
    }
  });

  // Analyze Vastu layout endpoint
  app.post("/api/vastu/analyze", upload.single('layoutImage'), async (req, res) => {
    try {
      // Parse the Vastu data from the form
      let vastuDataRaw;
      try {
        vastuDataRaw = JSON.parse(req.body.vastuData || '{}');
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return res.status(400).json({ message: "Invalid JSON in vastuData" });
      }
      
      // Validate input data with better error handling
      const vastuData = schemas.vastuInputSchema.parse(vastuDataRaw);
      
      let base64Image: string | undefined;
      let imageUrl: string | null = null;
      
      if (req.file) {
        base64Image = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      }
      
      // Analyze Vastu using OpenAI
      const analysisResult = await analyzeVastu(vastuData, base64Image);
      
      // Validate the analysis result with better error handling
      let validatedResult;
      try {
        validatedResult = schemas.vastuAnalysisResultSchema.parse(analysisResult);
      } catch (validationError) {
        console.error("Vastu result validation failed:", validationError);
        console.error("Raw analysis result:", JSON.stringify(analysisResult, null, 2));
        // Return the result anyway but log the validation error
        validatedResult = analysisResult;
      }
      
      // For now, return analysis without storing in database
      // TODO: Add proper user authentication and storage
      const analysisId = `vastu_${Date.now()}`;

      res.json({
        id: analysisId,
        result: validatedResult,
        inputData: vastuData,
        imageUrl,
      });
    } catch (error) {
      console.error("Vastu analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze Vastu layout" 
      });
    }
  });

  // Analyze numerology endpoint
  app.post("/api/numerology/analyze", async (req, res) => {
    try {
      const numerologyData = schemas.numerologyInputSchema.parse(req.body);
      
      // Analyze using OpenAI
      const analysisResult = await analyzeNumerology(numerologyData);
      
      // Validate the analysis result
      const validatedResult = numerologyAnalysisResultSchema.parse(analysisResult);
      
      // For now, return analysis without storing in database
      // TODO: Add proper user authentication and storage
      const analysisId = `numerology_${Date.now()}`;

      res.json({
        id: analysisId,
        result: validatedResult,
        inputData: numerologyData,
      });
    } catch (error) {
      console.error("Numerology analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze numerology" 
      });
    }
  });

  // Analyze tarot endpoint
  app.post("/api/tarot/analyze", async (req, res) => {
    try {
      const tarotData = schemas.tarotInputSchema.parse(req.body);
      
      // Analyze using OpenAI
      const analysisResult = await analyzeTarot(tarotData);
      
      // Validate the analysis result
      const validatedResult = tarotAnalysisResultSchema.parse(analysisResult);
      
      // For now, return analysis without storing in database
      // TODO: Add proper user authentication and storage
      const analysisId = `tarot_${Date.now()}`;

      res.json({
        id: analysisId,
        result: validatedResult,
        inputData: tarotData,
      });
    } catch (error) {
      console.error("Tarot analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze tarot reading" 
      });
    }
  });

  // Get analysis by ID (generic endpoint)
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve analysis" });
    }
  });

  // Chat conversation endpoints  
  app.get("/api/chat/conversation/:analysisId", async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { analysisId } = req.params;
      const userId = req.session.userId;

      // Get or create conversation
      let conversation = await storage.getChatConversationByAnalysis(analysisId, userId);
      if (!conversation) {
        conversation = await storage.createChatConversation({
          analysisId,
          userId,
        });
      }

      // Get messages for this conversation
      const messages = await storage.getChatMessagesByConversation(conversation.id);

      res.json({ messages });
    } catch (error) {
      console.error("Chat conversation error:", error);
      res.status(500).json({ message: "Failed to get conversation" });
    }
  });

  // Send chat message (simplified without payment)
  app.post("/api/chat/send", async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { analysisId, analysisType, message, analysisData } = req.body;
      const userId = req.session.userId;

      // Get or create conversation
      let conversation = await storage.getChatConversationByAnalysis(analysisId, userId);
      if (!conversation) {
        conversation = await storage.createChatConversation({
          analysisId,
          userId,
        });
      }

      // Get current messages
      const messages = await storage.getChatMessagesByConversation(conversation.id);

      // Save user message
      await storage.createChatMessage({
        conversationId: conversation.id,
        role: 'user',
        content: message,
      });

      // Generate AI response using OpenAI
      const aiResponse = await generateChatResponse(message, analysisType, analysisData, messages);

      // Save AI response
      await storage.createChatMessage({
        conversationId: conversation.id,
        role: 'assistant', 
        content: aiResponse,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // General AI Chat endpoint for mystical guidance
  app.post("/api/chat", async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Generate AI response using OpenAI for general mystical chat
      const aiResponse = await generateMysticalChatResponse(
        message, 
        conversationHistory || []
      );

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Mystical chat error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate chat response" 
      });
    }
  });

  // Get available payment tiers
  app.get("/api/payments/tiers", (req, res) => {
    res.json(PAYMENT_TIERS);
  });

  // Razorpay Payment Routes
  app.post("/api/payments/create-order", requireAuth, async (req: any, res) => {
    try {
      const { paymentTier } = req.body;
      const userId = req.session.userId;

      if (!paymentTier) {
        return res.status(400).json({ message: "Payment tier is required" });
      }

      // Find the selected tier
      const tier = PAYMENT_TIERS.find(t => t.id === paymentTier);
      if (!tier) {
        return res.status(400).json({ message: "Invalid payment tier" });
      }

      // Create payment record first
      const payment = await storage.createPayment({
        userId,
        amount: tier.amount.toString(),
        creditsGranted: tier.credits,
        minutesGranted: tier.minutes,
        paymentTier: tier.id,
        status: 'pending'
      });

      // Create Razorpay order
      const order = await createRazorpayOrder(tier.amount, 'INR');
      
      res.json({
        orderId: order.id,
        amount: tier.amount,
        currency: "INR",
        paymentId: payment.id,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error("Create payment order error:", error);
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", requireAuth, async (req: any, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId } = req.body;
      const userId = req.session.userId;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !paymentId) {
        return res.status(400).json({ message: "Missing required payment verification parameters" });
      }

      // Verify Razorpay signature
      const isSignatureValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isSignatureValid) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
      
      // Update payment status
      const payment = await storage.updatePaymentStatus(
        paymentId,
        'completed',
        razorpay_payment_id,
        new Date()
      );

      // Get current user
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add credits to user
      const newAiChatCredits = user.aiChatCredits + payment.creditsGranted;
      await storage.updateUserAiChatCredits(userId, newAiChatCredits, user.aiChatMinutesUsed);

      res.json({ 
        success: true,
        creditsAdded: payment.creditsGranted,
        totalCredits: newAiChatCredits,
        message: `Successfully added ${payment.creditsGranted} credits to your account!`
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Payment verification failed" });
    }
  });

  // Test endpoint to isolate OpenAI issues
  app.post("/api/test-openai", async (req, res) => {
    try {
      console.log("Test endpoint called");
      res.json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Test endpoint error:", error);
      res.status(500).json({ message: "Test endpoint failed" });
    }
  });

  // Credit-based AI Chat endpoint
  app.post("/api/ai-chat", requireAuth, async (req: any, res) => {
    try {
      const { message } = req.body;
      const userId = req.session.userId;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get current user and check credits
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.aiChatCredits <= 0) {
        return res.status(403).json({ 
          message: "No AI chat credits remaining", 
          needsPayment: true 
        });
      }

      // Get or create AI chat session
      let session = await storage.getActiveAiChatSession(userId);
      if (!session) {
        session = await storage.createAiChatSession({
          userId,
          status: 'active'
        });
      }

      // Save user message
      await storage.createAiChatMessage({
        sessionId: session.id,
        role: 'user',
        content: message
      });

      // Generate AI response
      const aiResponse = await generateMysticalChatResponse(message, []);

      // Save AI response
      await storage.createAiChatMessage({
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse
      });

      // Deduct 1 credit and update usage
      const newCredits = user.aiChatCredits - 1;
      const estimatedMinutes = parseFloat((Number(session.minutesUsed) + 0.2).toFixed(2)); // Estimate ~0.2 minutes per exchange
      
      await Promise.all([
        storage.updateUserAiChatCredits(userId, newCredits, user.aiChatMinutesUsed),
        storage.updateAiChatSessionUsage(session.id, estimatedMinutes, session.creditsUsed + 1)
      ]);

      res.json({ 
        response: aiResponse,
        creditsRemaining: newCredits,
        minutesUsed: estimatedMinutes
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process AI chat" 
      });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
