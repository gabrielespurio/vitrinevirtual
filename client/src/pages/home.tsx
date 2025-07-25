import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Eye, Zap, Share2, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Flash Vitrine</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#como-funciona" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Como Funciona</a>
                <a href="#exemplo" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Exemplos</a>
                <Link href="/criar">
                  <Button>Criar Vitrine</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Crie sua <span className="text-primary">vitrine digital</span><br />em minutos
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Transforme seus produtos em uma vitrine profissional e compartilhe com seus clientes através de um link único. Simples, rápido e totalmente gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/criar">
                <Button size="lg" className="bg-primary text-white px-8 py-4 text-lg">
                  <Rocket className="mr-2 w-5 h-5" />
                  Criar Minha Vitrine
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                <Eye className="mr-2 w-5 h-5" />
                Ver Exemplo
              </Button>
            </div>
          </div>
          <div className="mt-16">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Interface de vitrine digital moderna" 
              className="rounded-2xl shadow-2xl mx-auto max-w-4xl w-full" 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tudo que você precisa para vender online
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Uma solução completa para criar e compartilhar seus produtos de forma profissional
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Criação Rápida</h3>
              <p className="text-slate-600">Monte sua vitrine em menos de 5 minutos. Adicione produtos, imagens e descrições de forma intuitiva.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Compartilhamento Fácil</h3>
              <p className="text-slate-600">Receba um link único para sua vitrine e compartilhe no WhatsApp, redes sociais ou onde quiser.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">100% Responsivo</h3>
              <p className="text-slate-600">Sua vitrine fica perfeita em qualquer dispositivo - celular, tablet ou computador.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Vitrine */}
      <section id="exemplo" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Veja como fica sua vitrine
            </h2>
            <p className="text-xl text-slate-600">
              Exemplo de uma vitrine criada com Flash Vitrine
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
                alt="Capa da vitrine exemplo" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                <div className="p-8 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Moda Feminina Clara</h1>
                  <p className="text-lg opacity-90">Roupas femininas modernas e elegantes para todas as ocasiões</p>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="mb-8 text-center">
                <Button className="bg-green-500 hover:bg-green-600">
                  <Share2 className="mr-2 w-4 h-4" />
                  Compartilhar no WhatsApp
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                    nome: "Vestido Preto Elegante",
                    descricao: "Vestido midi preto com modelagem elegante, perfeito para ocasiões especiais.",
                    preco: "189,90"
                  },
                  {
                    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                    nome: "Blusa Branca Casual",
                    descricao: "Blusa branca versátil, ideal para looks casuais e profissionais.",
                    preco: "79,90"
                  },
                  {
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                    nome: "Calça Jeans Azul",
                    descricao: "Jeans de corte moderno e confortável, essencial no guarda-roupa.",
                    preco: "159,90"
                  }
                ].map((produto, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={produto.image} alt={produto.nome} className="w-full h-48 object-cover" />
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{produto.nome}</h3>
                      <p className="text-slate-600 text-sm mb-3">{produto.descricao}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-green-600">R$ {produto.preco}</span>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700 w-full">
                        <Eye className="mr-2 w-4 h-4" />
                        Comprar via WhatsApp
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12 text-center border-t border-slate-200 pt-8">
                <p className="text-slate-500 text-sm mb-4">Vitrine criada com</p>
                <div className="flex items-center justify-center">
                  <h3 className="text-xl font-bold text-primary">Flash Vitrine</h3>
                  <Link href="/criar">
                    <Button variant="link" className="ml-4">Criar minha vitrine</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para criar sua vitrine?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empreendedores que já estão vendendo mais com Flash Vitrine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/criar">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg">
                Começar Agora - É Grátis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg">
              Ver Mais Exemplos
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Flash Vitrine</h3>
              <p className="text-slate-300 mb-6">
                A forma mais simples de criar vitrines digitais profissionais e aumentar suas vendas online.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#como-funciona" className="hover:text-white">Como Funciona</a></li>
                <li><a href="#exemplo" className="hover:text-white">Exemplos</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Flash Vitrine. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
