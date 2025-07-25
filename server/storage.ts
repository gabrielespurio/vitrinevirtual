import { type Usuario, type InsertUsuario, type Vitrine, type InsertVitrine, type Produto, type InsertProduto, usuarios, vitrines, produtos } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

export interface IStorage {
  // Usuários
  getUser(id: string): Promise<Usuario | undefined>;
  getUserByEmail(email: string): Promise<Usuario | undefined>;
  createUser(user: InsertUsuario): Promise<Usuario>;

  // Vitrines
  getVitrine(id: string): Promise<Vitrine | undefined>;
  getVitrineBySlug(slug: string): Promise<Vitrine | undefined>;
  createVitrine(vitrine: InsertVitrine): Promise<Vitrine>;
  updateVitrine(id: string, data: Partial<Vitrine>): Promise<Vitrine | undefined>;
  getVitrinesByUsuario(usuarioId: string): Promise<Vitrine[]>;

  // Produtos
  getProduto(id: string): Promise<Produto | undefined>;
  getProdutosByVitrine(vitrineId: string): Promise<Produto[]>;
  createProduto(produto: InsertProduto): Promise<Produto>;
  updateProduto(id: string, data: Partial<Produto>): Promise<Produto | undefined>;
  deleteProduto(id: string): Promise<boolean>;

  // Session store
  sessionStore: any;
}

// Configuração do session store PostgreSQL
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Usuários
  async getUser(id: string): Promise<Usuario | undefined> {
    const [user] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<Usuario | undefined> {
    const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUsuario): Promise<Usuario> {
    const [user] = await db
      .insert(usuarios)
      .values(insertUser)
      .returning();
    return user;
  }

  // Vitrines
  async getVitrine(id: string): Promise<Vitrine | undefined> {
    const [vitrine] = await db.select().from(vitrines).where(eq(vitrines.id, id));
    return vitrine || undefined;
  }

  async getVitrineBySlug(slug: string): Promise<Vitrine | undefined> {
    const [vitrine] = await db.select().from(vitrines).where(eq(vitrines.slug, slug));
    return vitrine || undefined;
  }

  async createVitrine(insertVitrine: InsertVitrine & { usuario_id: string }): Promise<Vitrine> {
    const [vitrine] = await db
      .insert(vitrines)
      .values(insertVitrine)
      .returning();
    return vitrine;
  }

  async updateVitrine(id: string, data: Partial<Vitrine>): Promise<Vitrine | undefined> {
    try {
      const [vitrine] = await db
        .update(vitrines)
        .set(data)
        .where(eq(vitrines.id, id))
        .returning();
      return vitrine;
    } catch (error) {
      return undefined;
    }
  }

  async getVitrinesByUsuario(usuarioId: string): Promise<Vitrine[]> {
    return await db.select().from(vitrines).where(eq(vitrines.usuario_id, usuarioId));
  }

  // Produtos
  async getProduto(id: string): Promise<Produto | undefined> {
    const [produto] = await db.select().from(produtos).where(eq(produtos.id, id));
    return produto || undefined;
  }

  async getProdutosByVitrine(vitrineId: string): Promise<Produto[]> {
    return await db.select().from(produtos).where(eq(produtos.vitrine_id, vitrineId));
  }

  async createProduto(insertProduto: InsertProduto): Promise<Produto> {
    const [produto] = await db
      .insert(produtos)
      .values(insertProduto)
      .returning();
    return produto;
  }

  async updateProduto(id: string, data: Partial<Produto>): Promise<Produto | undefined> {
    try {
      const [produto] = await db
        .update(produtos)
        .set(data)
        .where(eq(produtos.id, id))
        .returning();
      return produto;
    } catch (error) {
      return undefined;
    }
  }

  async deleteProduto(id: string): Promise<boolean> {
    try {
      await db.delete(produtos).where(eq(produtos.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
