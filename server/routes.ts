import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVitrineSchema, insertProdutoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
