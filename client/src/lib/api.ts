import { apiRequest } from "@/lib/queryClient";
import type { InsertVitrine, InsertProduto } from "@shared/schema";

export const api = {
  // Vitrines
  createVitrine: async (data: InsertVitrine) => {
    const response = await apiRequest("POST", "/api/vitrines", data);
    return response.json();
  },

  getVitrineBySlug: async (slug: string) => {
    const response = await apiRequest("GET", `/api/vitrine/${slug}`);
    return response.json();
  },

  // Produtos
  createProduto: async (data: InsertProduto) => {
    const response = await apiRequest("POST", "/api/produtos", data);
    return response.json();
  },

  deleteProduto: async (id: string) => {
    const response = await apiRequest("DELETE", `/api/produtos/${id}`);
    return response.json();
  },
};
