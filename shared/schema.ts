import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const usuarios = pgTable("usuarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  email: text("email").unique().notNull(),
  senha: text("senha").notNull(),
});

export const vitrines = pgTable("vitrines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  usuario_id: varchar("usuario_id").references(() => usuarios.id).notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  slug: text("slug").unique().notNull(),
  imagem_capa: text("imagem_capa"),
});

export const produtos = pgTable("produtos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vitrine_id: varchar("vitrine_id").references(() => vitrines.id).notNull(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  imagem_url: text("imagem_url"),
  preco: text("preco").notNull(), // Preço do produto
  disponivel: integer("disponivel").default(1), // 1 = disponível, 0 = indisponível
});

export const insertUsuarioSchema = createInsertSchema(usuarios).pick({
  nome: true,
  email: true,
  senha: true,
}).extend({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email deve ser válido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Email deve ser válido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

export const insertVitrineSchema = createInsertSchema(vitrines).pick({
  nome: true,
  descricao: true,
  slug: true,
  imagem_capa: true,
}).extend({
  nome: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
});

export const insertProdutoSchema = createInsertSchema(produtos).pick({
  vitrine_id: true,
  nome: true,
  descricao: true,
  imagem_url: true,
  preco: true,
  disponivel: true,
}).extend({
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  preco: z.string().min(1, "Preço é obrigatório").regex(/^\d+([.,]\d{1,2})?$/, "Preço deve estar no formato: 10,00 ou 10.00"),
});

export type InsertUsuario = z.infer<typeof insertUsuarioSchema>;
export type Usuario = typeof usuarios.$inferSelect;
export type Login = z.infer<typeof loginSchema>;

export type InsertVitrine = z.infer<typeof insertVitrineSchema>;
export type Vitrine = typeof vitrines.$inferSelect;

export type InsertProduto = z.infer<typeof insertProdutoSchema>;
export type Produto = typeof produtos.$inferSelect;
