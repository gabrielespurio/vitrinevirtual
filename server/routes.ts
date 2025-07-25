import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVitrineSchema, insertProdutoSchema, insertUsuarioSchema, loginSchema } from "@shared/schema";
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

  // Middleware para autenticação simples com sessão
  const session: { [key: string]: { userId: string; userName: string } } = {};

  // Middleware para verificar autenticação
  const requireAuth = (req: any, res: any, next: any) => {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !session[sessionId]) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    req.user = session[sessionId];
    next();
  };

  // Rota de cadastro
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUsuarioSchema.parse(req.body);
      
      // Verificar se o email já existe
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      const user = await storage.createUser(userData);
      const sessionId = Date.now().toString() + Math.random().toString(36);
      session[sessionId] = { userId: user.id, userName: user.nome };

      res.json({ 
        user: { id: user.id, nome: user.nome, email: user.email },
        sessionId 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Rota de login
  app.post("/api/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(loginData.email);
      if (!user || user.senha !== loginData.senha) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const sessionId = Date.now().toString() + Math.random().toString(36);
      session[sessionId] = { userId: user.id, userName: user.nome };

      res.json({ 
        user: { id: user.id, nome: user.nome, email: user.email },
        sessionId 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Rota de logout
  app.post("/api/logout", (req, res) => {
    const sessionId = req.headers['x-session-id'] as string;
    if (sessionId && session[sessionId]) {
      delete session[sessionId];
    }
    res.json({ message: "Logout realizado com sucesso" });
  });

  // Rota para verificar sessão atual
  app.get("/api/me", (req, res) => {
    const sessionId = req.headers['x-session-id'] as string;
    if (!sessionId || !session[sessionId]) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    res.json({ user: session[sessionId] });
  });

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

      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId || !session[sessionId]) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const vitrine = await storage.createVitrine({
        ...validatedData,
        usuario_id: session[sessionId].userId
      });
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

  // Buscar vitrines do usuário
  app.get("/api/vitrines/user", async (req, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      if (!sessionId || !session[sessionId]) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const vitrines = await storage.getVitrinesByUserId(session[sessionId].userId);
      const vitrinesWithProducts = await Promise.all(
        vitrines.map(async (vitrine) => ({
          ...vitrine,
          produtos: await storage.getProdutosByVitrine(vitrine.id)
        }))
      );
      
      res.json(vitrinesWithProducts);
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
