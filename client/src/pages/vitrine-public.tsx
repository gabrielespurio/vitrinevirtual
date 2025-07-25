import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, ExternalLink, ArrowLeft, Eye, Heart, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function VitrinePublic() {
  const [match, params] = useRoute("/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;

  const { data, isLoading, error } = useQuery<{
    vitrine: { id: string; nome: string; descricao: string | null; slug: string; imagem_capa: string | null; usuario_id: string | null; };
    produtos: { id: string; nome: string; descricao: string | null; imagem_url: string | null; preco: string; disponivel: number; vitrine_id: string; }[];
  }>({
    queryKey: ["/api/vitrine", slug],
    enabled: !!slug,
  });

  const handleWhatsAppShare = () => {
    if (!data?.vitrine) return;
    
    const url = window.location.href;
    const text = `Confira os produtos da ${data.vitrine.nome}!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const handleBuyProduct = (productId: string, productName: string, price: string) => {
    // Gerar link de WhatsApp para compra
    const message = `Olá! Tenho interesse no produto *${productName}* por R$ ${price} da vitrine ${data?.vitrine.nome}. 

Link: ${window.location.href}

Podemos conversar sobre a compra?`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/${slug}/produto/${productId}`);
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
              A vitrine que você está procurando não existe ou foi removida.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar ao início
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
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10"></div>
        <div className="relative h-72 md:h-96">
          <img 
            src={vitrine.imagem_capa || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"} 
            alt={`Capa da vitrine ${vitrine.nome}`}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} disponíveis
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {vitrine.nome}
              </h1>
              {vitrine.descricao && (
                <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                  {vitrine.descricao}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Action Bar */}
        <Card className="mb-8 shadow-lg border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-slate-600">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm">Vitrine pública</span>
                </div>
              </div>
              <Button 
                onClick={handleWhatsAppShare}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
              >
                <Share2 className="mr-2 w-4 h-4" />
                Compartilhar no WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {produtos && produtos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {produtos.map((produto) => (
              <Card 
                key={produto.id} 
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={produto.imagem_url || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
                    alt={produto.nome} 
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute top-4 right-4">
                    {produto.disponivel === 0 ? (
                      <Badge variant="destructive" className="shadow-lg">
                        Esgotado
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white shadow-lg">
                        Disponível
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewProduct(produto.id)}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {produto.nome}
                    </h3>
                    {produto.descricao && (
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {produto.descricao}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-primary">
                        R$ {produto.preco}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewProduct(produto.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detalhes
                    </Button>
                    <Button 
                      onClick={() => handleBuyProduct(produto.id, produto.nome, produto.preco)}
                      disabled={produto.disponivel === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                    >
                      <ShoppingCart className="mr-2 w-4 h-4" />
                      {produto.disponivel === 0 ? "Esgotado" : "Comprar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 shadow-lg border-0">
            <CardContent>
              <div className="text-slate-400 mb-4">
                <ShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Nenhum produto disponível
              </h3>
              <p className="text-slate-600">
                Esta vitrine ainda não possui produtos cadastrados.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="mt-8 shadow-lg border-0 bg-slate-900 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <h3 className="text-2xl font-bold text-primary mr-2">Flash Vitrine</h3>
              <Badge variant="secondary" className="text-xs">
                Powered by
              </Badge>
            </div>
            <p className="text-slate-300 mb-6">
              Crie sua vitrine digital profissional em minutos
            </p>
            <Link href="/">
              <Button variant="secondary" className="shadow-lg">
                Criar minha vitrine gratuita
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
