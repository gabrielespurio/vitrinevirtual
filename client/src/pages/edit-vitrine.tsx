import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  DollarSign,
  Package
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EditVitrine() {
  const [match, params] = useRoute("/vitrine/:slug/editar");
  const [, navigate] = useLocation();
  const slug = params?.slug;
  const { toast } = useToast();

  // Estados para edição
  const [isEditingVitrine, setIsEditingVitrine] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Estados do formulário da vitrine
  const [vitrineNome, setVitrineNome] = useState("");
  const [vitrineDescricao, setVitrineDescricao] = useState("");
  const [vitrineImageFile, setVitrineImageFile] = useState<File | null>(null);

  // Estados do formulário de produto
  const [produtoNome, setProdutoNome] = useState("");
  const [produtoDescricao, setProdutoDescricao] = useState("");
  const [produtoPreco, setProdutoPreco] = useState("");
  const [produtoImageFile, setProdutoImageFile] = useState<File | null>(null);
  const [produtoDisponivel, setProdutoDisponivel] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/vitrine", slug],
    enabled: !!slug,
  });

  // Efeito para popular os dados da vitrine quando carregados
  useEffect(() => {
    if (data?.vitrine) {
      setVitrineNome(data.vitrine.nome);
      setVitrineDescricao(data.vitrine.descricao || "");
    }
  }, [data]);

  // Mutation para atualizar vitrine
  const updateVitrineMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/vitrines/${data?.vitrine.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Erro ao atualizar vitrine');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Vitrine atualizada com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/vitrine", slug] });
      setIsEditingVitrine(false);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Tente novamente mais tarde";
      toast({ 
        title: "Erro ao atualizar vitrine", 
        description: message,
        variant: "destructive"
      });
    }
  });

  // Mutation para adicionar produto
  const addProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Erro ao adicionar produto');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Produto adicionado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/vitrine", slug] });
      resetProductForm();
      setIsAddingProduct(false);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Tente novamente mais tarde";
      toast({ 
        title: "Erro ao adicionar produto", 
        description: message,
        variant: "destructive"
      });
    }
  });

  // Mutation para atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Erro ao atualizar produto');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Produto atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/vitrine", slug] });
      resetProductForm();
      setEditingProduct(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Tente novamente mais tarde";
      toast({ 
        title: "Erro ao atualizar produto", 
        description: message,
        variant: "destructive"
      });
    }
  });

  // Mutation para deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`/api/produtos/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar produto');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Produto removido com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/vitrine", slug] });
    },
    onError: () => {
      toast({ 
        title: "Erro ao remover produto", 
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  });

  const resetProductForm = () => {
    setProdutoNome("");
    setProdutoDescricao("");
    setProdutoPreco("");
    setProdutoImageFile(null);
    setProdutoDisponivel(1);
    setEditingProduct(null);
  };

  const handleUpdateVitrine = () => {
    const formData = new FormData();
    formData.append('nome', vitrineNome);
    formData.append('descricao', vitrineDescricao);
    if (vitrineImageFile) {
      formData.append('imagem', vitrineImageFile);
    }
    updateVitrineMutation.mutate(formData);
  };

  const handleAddProduct = () => {
    if (!data?.vitrine.id) return;
    
    const formData = new FormData();
    formData.append('vitrine_id', data.vitrine.id);
    formData.append('nome', produtoNome);
    formData.append('descricao', produtoDescricao);
    formData.append('preco', produtoPreco);
    formData.append('disponivel', produtoDisponivel.toString());
    if (produtoImageFile) {
      formData.append('imagem', produtoImageFile);
    }
    addProductMutation.mutate(formData);
  };

  const handleUpdateProduct = (productId: string) => {
    const formData = new FormData();
    formData.append('nome', produtoNome);
    formData.append('descricao', produtoDescricao);
    formData.append('preco', produtoPreco);
    formData.append('disponivel', produtoDisponivel.toString());
    if (produtoImageFile) {
      formData.append('imagem', produtoImageFile);
    }
    updateProductMutation.mutate({ id: productId, formData });
  };

  const handleEditProduct = (produto: any) => {
    setProdutoNome(produto.nome);
    setProdutoDescricao(produto.descricao || "");
    setProdutoPreco(produto.preco);
    setProdutoDisponivel(produto.disponivel);
    setEditingProduct(produto);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Tem certeza que deseja remover este produto?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando vitrine...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.vitrine) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Vitrine não encontrada</h1>
            <p className="text-slate-600 mb-6">
              A vitrine que você está tentando editar não existe ou foi removida.
            </p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar ao dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { vitrine, produtos } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Editando: {vitrine.nome}</h1>
              <p className="text-slate-600">Gerencie sua vitrine e produtos</p>
            </div>
          </div>
          <Link href={`/${slug}`}>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Ver vitrine pública
            </Button>
          </Link>
        </div>

        {/* Edição da Vitrine */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Informações da Vitrine
              </CardTitle>
              <Button
                onClick={() => setIsEditingVitrine(!isEditingVitrine)}
                variant={isEditingVitrine ? "secondary" : "outline"}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {isEditingVitrine ? "Cancelar" : "Editar"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditingVitrine ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome da Vitrine</Label>
                  <Input
                    id="nome"
                    value={vitrineNome}
                    onChange={(e) => setVitrineNome(e.target.value)}
                    placeholder="Digite o nome da vitrine"
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={vitrineDescricao}
                    onChange={(e) => setVitrineDescricao(e.target.value)}
                    placeholder="Descreva sua vitrine"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="imagem">Imagem de Capa</Label>
                  <Input
                    id="imagem"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setVitrineImageFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Tamanho máximo: 10MB. Formatos aceitos: JPG, PNG, GIF
                  </p>
                </div>
                <Button
                  onClick={handleUpdateVitrine}
                  disabled={updateVitrineMutation.isPending}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateVitrineMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {vitrine.imagem_capa && (
                    <img
                      src={vitrine.imagem_capa}
                      alt="Capa da vitrine"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{vitrine.nome}</h3>
                    <p className="text-slate-600">{vitrine.descricao || "Sem descrição"}</p>
                    <Badge variant="secondary" className="mt-2">
                      /{vitrine.slug}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Produtos ({produtos.length}/5)
              </CardTitle>
              <Dialog open={isAddingProduct} onOpenChange={(open) => {
                if (open) {
                  resetProductForm();
                }
                setIsAddingProduct(open);
              }}>
                <DialogTrigger asChild>
                  <Button disabled={produtos.length >= 5}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Produto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="produto-nome">Nome do Produto</Label>
                      <Input
                        id="produto-nome"
                        value={produtoNome}
                        onChange={(e) => setProdutoNome(e.target.value)}
                        placeholder="Nome do produto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="produto-descricao">Descrição</Label>
                      <Textarea
                        id="produto-descricao"
                        value={produtoDescricao}
                        onChange={(e) => setProdutoDescricao(e.target.value)}
                        placeholder="Descrição do produto"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="produto-preco">Preço</Label>
                      <Input
                        id="produto-preco"
                        value={produtoPreco}
                        onChange={(e) => setProdutoPreco(e.target.value)}
                        placeholder="Ex: 29,90"
                      />
                    </div>
                    <div>
                      <Label htmlFor="produto-imagem">Imagem</Label>
                      <Input
                        id="produto-imagem"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProdutoImageFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Tamanho máximo: 10MB. Formatos aceitos: JPG, PNG, GIF
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetProductForm();
                          setIsAddingProduct(false);
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddProduct}
                        disabled={addProductMutation.isPending || !produtoNome || !produtoPreco}
                        className="flex-1"
                      >
                        {addProductMutation.isPending ? "Adicionando..." : "Adicionar"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {produtos.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  Nenhum produto cadastrado
                </h3>
                <p className="text-slate-500 mb-4">
                  Adicione produtos para começar a vender
                </p>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Produto
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtos.map((produto) => (
                  <Card key={produto.id} className="group">
                    <div className="relative">
                      <img
                        src={produto.imagem_url || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                        alt={produto.nome}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={produto.disponivel ? "default" : "destructive"}>
                          {produto.disponivel ? "Disponível" : "Esgotado"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-1">{produto.nome}</h4>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {produto.descricao || "Sem descrição"}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-primary">
                          R$ {produto.preco}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog onOpenChange={(open) => {
                          if (!open) {
                            resetProductForm();
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                handleEditProduct(produto);
                              }}
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Produto</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-produto-nome">Nome do Produto</Label>
                                <Input
                                  id="edit-produto-nome"
                                  value={produtoNome}
                                  onChange={(e) => setProdutoNome(e.target.value)}
                                  placeholder="Nome do produto"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-produto-descricao">Descrição</Label>
                                <Textarea
                                  id="edit-produto-descricao"
                                  value={produtoDescricao}
                                  onChange={(e) => setProdutoDescricao(e.target.value)}
                                  placeholder="Descrição do produto"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-produto-preco">Preço</Label>
                                <Input
                                  id="edit-produto-preco"
                                  value={produtoPreco}
                                  onChange={(e) => setProdutoPreco(e.target.value)}
                                  placeholder="Ex: 29,90"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-produto-imagem">Nova Imagem</Label>
                                <Input
                                  id="edit-produto-imagem"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setProdutoImageFile(e.target.files?.[0] || null)}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                  Tamanho máximo: 10MB. Formatos aceitos: JPG, PNG, GIF
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    resetProductForm();
                                  }}
                                  className="flex-1"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => handleUpdateProduct(produto.id)}
                                  disabled={updateProductMutation.isPending || !produtoNome || !produtoPreco}
                                  className="flex-1"
                                >
                                  {updateProductMutation.isPending ? "Salvando..." : "Salvar"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(produto.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}