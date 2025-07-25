import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { insertVitrineSchema, type InsertVitrine } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface VitrineFormProps {
  onSubmit: (data: InsertVitrine) => void;
  isLoading?: boolean;
}

export function VitrineForm({ onSubmit, isLoading }: VitrineFormProps) {
  const [imagemCapa, setImagemCapa] = useState<File | null>(null);

  const form = useForm<InsertVitrine>({
    resolver: zodResolver(insertVitrineSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      slug: "",
      imagem_capa: "",
    },
  });

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    form.setValue("nome", nome);
    
    if (nome) {
      const slug = generateSlug(nome);
      form.setValue("slug", slug);
    }
  };

  const handleFileSelect = (file: File) => {
    setImagemCapa(file);
    // Para o MVP, vamos usar uma URL fictícia
    // Em produção, seria necessário implementar upload real
    form.setValue("imagem_capa", `https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400`);
  };

  const handleSubmit = (data: InsertVitrine) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold mr-4">1</div>
            <h3 className="text-2xl font-bold text-slate-900">Informações da Vitrine</h3>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nome" className="text-sm font-medium text-slate-700 mb-2 block">
                Nome da Vitrine *
              </Label>
              <Input
                id="nome"
                placeholder="Ex: Minha Loja de Roupas"
                {...form.register("nome")}
                onChange={handleNomeChange}
                className="w-full"
              />
              {form.formState.errors.nome && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.nome.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="slug" className="text-sm font-medium text-slate-700 mb-2 block">
                URL da Vitrine
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                  flashvitrine.com/
                </span>
                <Input
                  id="slug"
                  placeholder="minha-loja-roupas"
                  {...form.register("slug")}
                  className="rounded-l-none border-l-0"
                />
              </div>
              {form.formState.errors.slug && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.slug.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="descricao" className="text-sm font-medium text-slate-700 mb-2 block">
              Descrição da Vitrine
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva sua vitrine e o que você oferece..."
              rows={3}
              {...form.register("descricao")}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              Imagem de Capa
            </Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              placeholder="Clique para fazer upload ou arraste a imagem aqui"
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {isLoading ? "Criando..." : "Continuar para Produtos"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
