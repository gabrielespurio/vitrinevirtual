import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, ShoppingCart, Heart, Eye, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function ProdutoDetalhes() {
  const [match, params] = useRoute("/:slug/produto/:produtoId");
  const [, navigate] = useLocation();
  const { slug, produtoId } = params || {};

  const { data: vitrineData } = useQuery<{
    vitrine: { id: string; nome: string; descricao: string | null; slug: string; imagem_capa: string | null; usuario_id: string | null; };
    produtos: { id: string; nome: string; descricao: string | null; imagem_url: string | null; preco: string; disponivel: number; vitrine_id: string; }[];
  }>({
    queryKey: ["/api/vitrine", slug],
    enabled: !!slug,
  });

  const produto = vitrineData?.produtos.find(p => p.id === produtoId);

  const handleBuyProduct = () => {
    if (!produto || !vitrineData?.vitrine) return;
    
    const message = `Olá! Tenho interesse no produto *${produto.nome}* por R$ ${produto.preco} da vitrine ${vitrineData.vitrine.nome}. 

Link: ${window.location.origin}/${slug}

Podemos conversar sobre a compra?`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = () => {
    if (!produto) return;
    
    const url = window.location.href;
    const text = `Confira este produto: ${produto.nome} - R$ ${produto.preco}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
    
    window.open(whatsappUrl, "_blank");
  };

  if (!vitrineData || !produto) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Produto não encontrado</h1>
            <p className="text-slate-600 mb-6">
              O produto que você está procurando não existe ou foi removido.
            </p>
            <Link href={`/${slug}`}>
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar à vitrine
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${slug}`}>
              <Button variant="ghost" className="flex items-center text-slate-600 hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à vitrine
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="aspect-square relative">
                <img 
                  src={produto.imagem_url || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"} 
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {produto.disponivel === 0 ? (
                    <Badge variant="destructive" className="shadow-lg">
                      <XCircle className="w-3 h-3 mr-1" />
                      Esgotado
                    </Badge>
                  ) : (
                    <Badge className="bg-green-500 text-white shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Disponível
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Vitrine Info */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Sobre a vitrine</h3>
                <div className="flex items-center space-x-3">
                  <img 
                    src={vitrineData.vitrine.imagem_capa || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                    alt={vitrineData.vitrine.nome}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-slate-900">{vitrineData.vitrine.nome}</h4>
                    {vitrineData.vitrine.descricao && (
                      <p className="text-sm text-slate-600 line-clamp-1">{vitrineData.vitrine.descricao}</p>
                    )}
                  </div>
                </div>
                <Link href={`/${slug}`}>
                  <Button variant="outline" className="w-full mt-4">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver todos os produtos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {produto.nome}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-primary">
                  R$ {produto.preco}
                </span>
                {produto.disponivel === 0 ? (
                  <Badge variant="destructive" className="text-sm">
                    Produto esgotado
                  </Badge>
                ) : (
                  <Badge className="bg-green-500 text-white text-sm">
                    Em estoque
                  </Badge>
                )}
              </div>

              <Separator className="my-6" />

              {produto.descricao && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Descrição</h3>
                  <p className="text-slate-700 leading-relaxed text-base">
                    {produto.descricao}
                  </p>
                </div>
              )}

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={handleBuyProduct}
                  disabled={produto.disponivel === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg disabled:bg-gray-400"
                  size="lg"
                >
                  <ShoppingCart className="mr-3 w-5 h-5" />
                  {produto.disponivel === 0 ? "Produto esgotado" : "Comprar via WhatsApp"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  <Share2 className="mr-3 w-5 h-5" />
                  Compartilhar produto
                </Button>
              </div>

              {/* Additional Info */}
              <Card className="mt-8 shadow-lg border-0 bg-slate-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Informações de compra</h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                      <span>Pagamento via WhatsApp</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                      <span>Negociação direta com o vendedor</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                      <span>Condições de entrega a combinar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {vitrineData.produtos.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Outros produtos desta vitrine</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vitrineData.produtos.filter(p => p.id !== produtoId).slice(0, 4).map((p) => (
                <Card key={p.id} className="group overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={p.imagem_url || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"} 
                      alt={p.nome}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      {p.disponivel === 0 ? (
                        <Badge variant="destructive" className="text-xs">Esgotado</Badge>
                      ) : (
                        <Badge className="bg-green-500 text-white text-xs">Disponível</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 text-sm line-clamp-1">{p.nome}</h3>
                    <p className="text-lg font-bold text-primary mb-3">R$ {p.preco}</p>
                    <Link href={`/${slug}/produto/${p.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver detalhes
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}