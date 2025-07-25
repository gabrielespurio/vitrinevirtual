import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import { insertProdutoSchema, type InsertProduto, type Produto } from "@shared/schema";
import { Plus, Trash2, ArrowLeft, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  vitrineId: string;
  products: Produto[];
  onAddProduct: (data: Omit<InsertProduto, "vitrine_id">) => void;
  onRemoveProduct: (id: string) => void;
  onFinish: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ProductForm({ 
  vitrineId,
  products, 
  onAddProduct, 
  onRemoveProduct, 
  onFinish, 
  onBack,
  isLoading 
}: ProductFormProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState<string>("");
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: api.uploadImage,
    onSuccess: (data) => {
      setProductImageUrl(data.url);
      form.setValue("imagem_url", data.url);
      toast({
        title: "Imagem enviada!",
        description: "Imagem do produto carregada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar a imagem.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<Omit<InsertProduto, "vitrine_id">>({
    resolver: zodResolver(insertProdutoSchema.omit({ vitrine_id: true })),
    defaultValues: {
      nome: "",
      descricao: "",
      link_compra: "",
      imagem_url: "",
    },
  });

  const handleFileSelect = (file: File) => {
    uploadMutation.mutate(file);
  };

  const handleSubmit = (data: Omit<InsertProduto, "vitrine_id">) => {
    onAddProduct(data);
    form.reset();
    setShowAddForm(false);
    setProductImageUrl("");
  };

  const canAddMore = products.length < 5;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4">2</div>
              <h3 className="text-2xl font-bold text-slate-900">Adicionar Produtos</h3>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {products.length}/5 produtos
            </Badge>
          </div>
        </div>

        {/* Produtos existentes */}
        <div className="space-y-6 mb-6">
          {products.map((product, index) => (
            <div key={product.id} className="bg-slate-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-slate-900">Produto {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Nome:</p>
                  <p className="text-slate-900">{product.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Link:</p>
                  <p className="text-slate-600 truncate">{product.link_compra}</p>
                </div>
              </div>
              
              {product.descricao && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-700">Descrição:</p>
                  <p className="text-slate-600">{product.descricao}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formulário para adicionar produto */}
        {showAddForm ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Novo Produto</h4>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome" className="text-sm font-medium text-slate-700 mb-2 block">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Camiseta Básica Azul"
                    {...form.register("nome")}
                  />
                  {form.formState.errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.nome.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="link_compra" className="text-sm font-medium text-slate-700 mb-2 block">
                    Link de Compra *
                  </Label>
                  <Input
                    id="link_compra"
                    type="url"
                    placeholder="https://..."
                    {...form.register("link_compra")}
                  />
                  {form.formState.errors.link_compra && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.link_compra.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="descricao" className="text-sm font-medium text-slate-700 mb-2 block">
                  Descrição do Produto
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva seu produto..."
                  rows={2}
                  {...form.register("descricao")}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Imagem do Produto
                </Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  placeholder="Adicionar imagem do produto"
                  isLoading={uploadMutation.isPending}
                  uploadedUrl={productImageUrl}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setProductImageUrl("");
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading || uploadMutation.isPending}>
                  {isLoading ? "Adicionando..." : uploadMutation.isPending ? "Enviando imagem..." : "Adicionar Produto"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Botão para adicionar produto */
          canAddMore && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors group mb-6"
            >
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary mx-auto mb-2" />
              <p className="text-slate-600 group-hover:text-primary">Adicionar Produto</p>
            </button>
          )
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between pt-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-8 py-3"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar
          </Button>
          
          <Button
            onClick={onFinish}
            disabled={products.length === 0}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            Criar Vitrine
            <Check className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
