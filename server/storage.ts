import { type Usuario, type InsertUsuario, type Vitrine, type InsertVitrine, type Produto, type InsertProduto } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Usuários
  getUser(id: string): Promise<Usuario | undefined>;
  getUserByEmail(email: string): Promise<Usuario | undefined>;
  createUser(user: InsertUsuario): Promise<Usuario>;

  // Vitrines
  getVitrine(id: string): Promise<Vitrine | undefined>;
  getVitrineBySlug(slug: string): Promise<Vitrine | undefined>;
  createVitrine(vitrine: InsertVitrine): Promise<Vitrine>;
  getVitrinesByUsuario(usuarioId: string): Promise<Vitrine[]>;

  // Produtos
  getProduto(id: string): Promise<Produto | undefined>;
  getProdutosByVitrine(vitrineId: string): Promise<Produto[]>;
  createProduto(produto: InsertProduto): Promise<Produto>;
  deleteProduto(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private usuarios: Map<string, Usuario>;
  private vitrines: Map<string, Vitrine>;
  private produtos: Map<string, Produto>;

  constructor() {
    this.usuarios = new Map();
    this.vitrines = new Map();
    this.produtos = new Map();
  }

  // Usuários
  async getUser(id: string): Promise<Usuario | undefined> {
    return this.usuarios.get(id);
  }

  async getUserByEmail(email: string): Promise<Usuario | undefined> {
    return Array.from(this.usuarios.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUsuario): Promise<Usuario> {
    const id = randomUUID();
    const user: Usuario = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      nome: insertUser.nome || null,
      senha: insertUser.senha || null,
    };
    this.usuarios.set(id, user);
    return user;
  }

  // Vitrines
  async getVitrine(id: string): Promise<Vitrine | undefined> {
    return this.vitrines.get(id);
  }

  async getVitrineBySlug(slug: string): Promise<Vitrine | undefined> {
    return Array.from(this.vitrines.values()).find(
      (vitrine) => vitrine.slug === slug,
    );
  }

  async createVitrine(insertVitrine: InsertVitrine): Promise<Vitrine> {
    const id = randomUUID();
    const vitrine: Vitrine = { 
      ...insertVitrine, 
      id,
      usuario_id: null, // For MVP, no user authentication
      descricao: insertVitrine.descricao || null,
      imagem_capa: insertVitrine.imagem_capa || null,
    };
    this.vitrines.set(id, vitrine);
    return vitrine;
  }

  async getVitrinesByUsuario(usuarioId: string): Promise<Vitrine[]> {
    return Array.from(this.vitrines.values()).filter(
      (vitrine) => vitrine.usuario_id === usuarioId,
    );
  }

  // Produtos
  async getProduto(id: string): Promise<Produto | undefined> {
    return this.produtos.get(id);
  }

  async getProdutosByVitrine(vitrineId: string): Promise<Produto[]> {
    return Array.from(this.produtos.values()).filter(
      (produto) => produto.vitrine_id === vitrineId,
    );
  }

  async createProduto(insertProduto: InsertProduto): Promise<Produto> {
    const id = randomUUID();
    const produto: Produto = { 
      ...insertProduto, 
      id,
      descricao: insertProduto.descricao || null,
      imagem_url: insertProduto.imagem_url || null,
    };
    this.produtos.set(id, produto);
    return produto;
  }

  async deleteProduto(id: string): Promise<boolean> {
    return this.produtos.delete(id);
  }
}

export const storage = new MemStorage();
