import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVitrineSchema, insertProdutoSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configurar multer para upload de arquivos
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Servir arquivos estáticos da pasta uploads
  app.use("/uploads", express.static(uploadDir));

  // Upload de imagem
  app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no upload da imagem" });
    }
  });
  // Criar vitrine
  app.post("/api/vitrines", async (req, res) => {
    try {
      const validatedData = insertVitrineSchema.parse(req.body);
      
      // Verificar se slug já existe
      const existingVitrine = await storage.getVitrineBySlug(validatedData.slug);
      if (existingVitrine) {
        return res.status(400).json({ message: "Este slug já está em uso" });
      }

      const vitrine = await storage.createVitrine(validatedData);
      res.json(vitrine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Buscar vitrine por slug
  app.get("/api/vitrine/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const vitrine = await storage.getVitrineBySlug(slug);
      
      if (!vitrine) {
        return res.status(404).json({ message: "Vitrine não encontrada" });
      }

      const produtos = await storage.getProdutosByVitrine(vitrine.id);
      
      res.json({
        vitrine,
        produtos,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Adicionar produto à vitrine
  app.post("/api/produtos", async (req, res) => {
    try {
      const validatedData = insertProdutoSchema.parse(req.body);
      
      // Verificar se vitrine existe
      const vitrine = await storage.getVitrine(validatedData.vitrine_id);
      if (!vitrine) {
        return res.status(404).json({ message: "Vitrine não encontrada" });
      }

      // Verificar limite de 5 produtos
      const existingProdutos = await storage.getProdutosByVitrine(validatedData.vitrine_id);
      if (existingProdutos.length >= 5) {
        return res.status(400).json({ message: "Limite de 5 produtos atingido" });
      }

      const produto = await storage.createProduto(validatedData);
      res.json(produto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dados inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Remover produto
  app.delete("/api/produtos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProduto(id);
      
      if (!success) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
