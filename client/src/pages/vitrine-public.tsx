import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function VitrinePublic() {
  const [match, params] = useRoute("/:slug");
  const slug = params?.slug;

  const { data, isLoading, error } = useQuery({
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

  const handleProductClick = (linkCompra: string) => {
    window.open(linkCompra, "_blank");
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
    <div className="min-h-screen bg-slate-50">
      <Card className="max-w-6xl mx-auto overflow-hidden">
        {/* Vitrine Header */}
        <div className="relative h-64 md:h-80">
          <img 
            src={vitrine.imagem_capa || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400"} 
            alt={`Capa da vitrine ${vitrine.nome}`}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{vitrine.nome}</h1>
              {vitrine.descricao && (
                <p className="text-lg opacity-90">{vitrine.descricao}</p>
              )}
            </div>
          </div>
        </div>

        {/* Vitrine Content */}
        <CardContent className="p-8">
          {/* Share Button */}
          <div className="mb-8 text-center">
            <Button 
              onClick={handleWhatsAppShare}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <Share2 className="mr-2 w-4 h-4" />
              Compartilhar no WhatsApp
            </Button>
          </div>

          {/* Products Grid */}
          {produtos && produtos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={produto.imagem_url || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
                    alt={produto.nome} 
                    className="w-full h-48 object-cover" 
                  />
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{produto.nome}</h3>
                    {produto.descricao && (
                      <p className="text-slate-600 text-sm mb-4">{produto.descricao}</p>
                    )}
                    <Button 
                      onClick={() => handleProductClick(produto.link_compra)}
                      className="bg-primary hover:bg-blue-600 w-full"
                    >
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Comprar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Nenhum produto adicionado ainda.</p>
            </div>
          )}

          {/* Vitrine Footer */}
          <div className="mt-12 text-center border-t border-slate-200 pt-8">
            <p className="text-slate-500 text-sm mb-4">Vitrine criada com</p>
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-bold text-primary">Flash Vitrine</h3>
              <Link href="/">
                <Button variant="link" className="ml-4">Criar minha vitrine</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
