import { useState } from "react";
import { useMutation, queryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { VitrineForm } from "@/components/vitrine-form";
import { ProductForm } from "@/components/product-form";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { InsertVitrine, InsertProduto, Vitrine, Produto } from "@shared/schema";

export default function CreateVitrine() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [vitrine, setVitrine] = useState<Vitrine | null>(null);
  const [products, setProducts] = useState<Produto[]>([]);
  const { toast } = useToast();

  const createVitrineMutation = useMutation({
    mutationFn: api.createVitrine,
    onSuccess: (data) => {
      setVitrine(data);
      setCurrentStep(2);
      toast({
        title: "Vitrine criada!",
        description: "Agora adicione seus produtos.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar vitrine",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: api.createProduto,
    onSuccess: (data) => {
      setProducts(prev => [...prev, data]);
      toast({
        title: "Produto adicionado!",
        description: "Produto adicionado com sucesso à sua vitrine.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: api.deleteProduto,
    onSuccess: (_, productId) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Produto removido!",
        description: "Produto removido da sua vitrine.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover produto",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });

  const handleVitrineSubmit = (data: InsertVitrine) => {
    createVitrineMutation.mutate(data);
  };

  const handleAddProduct = (data: Omit<InsertProduto, "vitrine_id">) => {
    if (!vitrine) return;
    
    createProductMutation.mutate({
      ...data,
      vitrine_id: vitrine.id,
    });
  };

  const handleRemoveProduct = (productId: string) => {
    deleteProductMutation.mutate(productId);
  };

  const handleFinish = () => {
    if (!vitrine) return;
    
    toast({
      title: "Vitrine criada com sucesso!",
      description: "Sua vitrine está pronta para ser compartilhada.",
    });
    
    // Redirecionar para a vitrine criada
    setLocation(`/${vitrine.slug}`);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Crie sua vitrine agora
          </h2>
          <p className="text-xl text-slate-600">
            Preencha os dados abaixo e tenha sua vitrine pronta em minutos
          </p>
        </div>

        {currentStep === 1 ? (
          <VitrineForm
            onSubmit={handleVitrineSubmit}
            isLoading={createVitrineMutation.isPending}
          />
        ) : (
          <ProductForm
            vitrineId={vitrine?.id || ""}
            products={products}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
            onFinish={handleFinish}
            onBack={handleBack}
            isLoading={createProductMutation.isPending || deleteProductMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
