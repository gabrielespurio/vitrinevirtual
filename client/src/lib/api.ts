import { apiRequest } from "@/lib/queryClient";
import type { InsertVitrine, InsertProduto } from "@shared/schema";

export const api = {
  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro no upload da imagem");
    }

    return response.json();
  },

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
