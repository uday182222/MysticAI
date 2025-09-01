import type { Express } from "express";
import { createServer, type Server } from "http";
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
import { analyzePalmImage, analyzeAstrologyChart, analyzeVastu, analyzeNumerology, analyzeTarot, generateChatResponse } from "./services/openai";
import multer from "multer";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
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
  app.use(session({
    store: new PgSession({
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
      const userData = userRegistrationSchema.parse(req.body);
      
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
        credits: user.credits
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
      const loginData = userLoginSchema.parse(req.body);
      
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
        credits: user.credits
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
        credits: user.credits
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get user" 
      });
    }
  });

  // Analyze palm image endpoint
  app.post("/api/palm/analyze", upload.single('palmImage'), async (req, res) => {
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
      const validatedResult = palmAnalysisResultSchema.parse(analysisResult);
      
      // Store the analysis
      const palmAnalysis = await storage.createPalmAnalysis({
        imageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
        analysisResult: validatedResult,
      });

      res.json({
        id: palmAnalysis.id,
        result: validatedResult,
        imageUrl: palmAnalysis.imageUrl,
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
      const astrologyData = astrologyInputSchema.parse(req.body);
      
      // Analyze astrology chart using OpenAI
      const analysisResult = await analyzeAstrologyChart(astrologyData);
      
      // Validate the analysis result
      const validatedResult = astrologyAnalysisResultSchema.parse(analysisResult);
      
      // Store the analysis
      const analysis = await storage.createAnalysis({
        type: "astrology",
        imageUrl: null,
        inputData: astrologyData,
        analysisResult: validatedResult,
      });

      res.json({
        id: analysis.id,
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
      
      const vastuData = vastuInputSchema.parse(vastuDataRaw);
      
      let base64Image: string | undefined;
      let imageUrl: string | null = null;
      
      if (req.file) {
        base64Image = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      }
      
      // Analyze Vastu using OpenAI
      const analysisResult = await analyzeVastu(vastuData, base64Image);
      
      // Validate the analysis result
      const validatedResult = vastuAnalysisResultSchema.parse(analysisResult);
      
      // Store the analysis
      const analysis = await storage.createAnalysis({
        type: "vastu",
        imageUrl,
        inputData: vastuData,
        analysisResult: validatedResult,
      });

      res.json({
        id: analysis.id,
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
      const numerologyData = numerologyInputSchema.parse(req.body);
      
      // Analyze using OpenAI
      const analysisResult = await analyzeNumerology(numerologyData);
      
      // Validate the analysis result
      const validatedResult = numerologyAnalysisResultSchema.parse(analysisResult);
      
      // Store the analysis
      const numerologyAnalysis = await storage.createAnalysis({
        type: "numerology",
        inputData: numerologyData,
        analysisResult: validatedResult,
      });

      res.json({
        id: numerologyAnalysis.id,
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
      const tarotData = tarotInputSchema.parse(req.body);
      
      // Analyze using OpenAI
      const analysisResult = await analyzeTarot(tarotData);
      
      // Validate the analysis result
      const validatedResult = tarotAnalysisResultSchema.parse(analysisResult);
      
      // Store the analysis
      const tarotAnalysis = await storage.createAnalysis({
        type: "tarot",
        inputData: tarotData,
        analysisResult: validatedResult,
      });

      res.json({
        id: tarotAnalysis.id,
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


  const httpServer = createServer(app);
  return httpServer;
}
