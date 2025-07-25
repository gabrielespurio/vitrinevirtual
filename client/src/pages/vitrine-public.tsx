import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowLeft, Eye, ShoppingCart, Star } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Carregando vitrine...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.vitrine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-slate-800/80 backdrop-blur-xl border-slate-700">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Vitrine não encontrada</h1>
            <p className="text-slate-300 mb-6">
              A vitrine que você está procurando não existe ou foi removida.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Premium Hero Section with Floating Elements */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"></div>
          
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img 
              src={vitrine.imagem_capa || "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200"} 
              alt={`Capa da vitrine ${vitrine.nome}`}
              className="w-full h-full object-cover opacity-40" 
            />
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center min-h-screen">
            <div className="flex flex-col lg:flex-row items-center gap-12 w-full">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <Badge className="inline-flex items-center mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-500/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  {produtos.length} {produtos.length === 1 ? 'produto exclusivo' : 'produtos exclusivos'}
                </Badge>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-8 leading-none tracking-tight">
                  {vitrine.nome}
                </h1>
                
                {vitrine.descricao && (
                  <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed mb-8 font-light">
                    {vitrine.descricao}
                  </p>
                )}
                
                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    onClick={handleWhatsAppShare}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl border-0 rounded-full"
                  >
                    <Share2 className="mr-3 w-5 h-5" />
                    Compartilhar Coleção
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm rounded-full"
                    onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Ver Produtos
                  </Button>
                </div>
              </div>
              
              {/* Right Decorative Element */}
              <div className="flex-1 relative hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-600/30 blur-3xl rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    <div className="text-center">
                      <div className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                        {produtos.length}
                      </div>
                      <div className="text-white/70 text-lg">
                        {produtos.length === 1 ? 'Produto Premium' : 'Produtos Premium'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Products Section */}
      <div id="produtos" className="relative bg-gradient-to-b from-black to-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent mb-6">
              Coleção Exclusiva
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6"></div>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Descubra nossa seleção premium de produtos cuidadosamente escolhidos para você
            </p>
          </div>

          {/* Products Grid */}
          {produtos && produtos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {produtos.map((produto) => (
                <Card 
                  key={produto.id} 
                  className="group overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={produto.imagem_url || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
                      alt={produto.nome} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4">
                      {produto.disponivel === 0 ? (
                        <Badge variant="destructive" className="shadow-lg backdrop-blur-sm">
                          Esgotado
                        </Badge>
                      ) : (
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg backdrop-blur-sm">
                          Disponível
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                        {produto.nome}
                      </h3>
                      {produto.descricao && (
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                          {produto.descricao}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                          R$ {produto.preco}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                        onClick={() => handleViewProduct(produto.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                      <Button 
                        onClick={() => handleBuyProduct(produto.id, produto.nome, produto.preco)}
                        disabled={produto.disponivel === 0}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 shadow-lg"
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
            <Card className="text-center py-16 bg-slate-800/80 backdrop-blur-xl border-slate-700">
              <CardContent>
                <div className="text-slate-400 mb-6">
                  <ShoppingCart className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Nenhum produto disponível
                </h3>
                <p className="text-slate-300">
                  Esta vitrine ainda não possui produtos cadastrados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Premium Footer */}
      <div className="relative bg-gradient-to-t from-slate-950 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mr-3">Flash Vitrine</h3>
            <Badge variant="secondary" className="text-xs bg-white/10 text-white/70 border-white/20">
              Premium Edition
            </Badge>
          </div>
          <p className="text-slate-300 mb-8 text-lg">
            Crie sua vitrine digital profissional em minutos
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-4 text-lg font-semibold shadow-2xl rounded-full">
              Criar minha vitrine gratuita
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}