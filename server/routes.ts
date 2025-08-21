import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPalmAnalysisSchema, analysisResultSchema } from "@shared/schema";
import { analyzePalmImage } from "./services/openai";
import multer from "multer";

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
      
      // Validate the analysis result
      const validatedResult = analysisResultSchema.parse(analysisResult);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
