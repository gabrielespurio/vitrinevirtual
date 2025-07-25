import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  Plus, 
  ExternalLink, 
  TrendingUp,
  Package,
  Users,
  Calendar
} from "lucide-react";
import { authManager } from "@/lib/auth";

interface Vitrine {
  id: string;
  nome: string;
  descricao: string;
  slug: string;
  imagem_capa?: string;
  created_at: string;
  produtos?: Array<{
    id: string;
    nome: string;
    preco: number;
  }>;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const user = authManager.getUser();

  // Query para buscar vitrines do usuário
  const { data: vitrines = [], isLoading } = useQuery<Vitrine[]>({
    queryKey: ['/api/vitrines/user'],
    enabled: !!user?.id,
  });

  // Dados simulados para analytics (será substituído por dados reais)
  const analyticsData = {
    totalViews: 1247,
    totalClicks: 89,
    conversionRate: 7.1,
    topVitrine: vitrines[0]?.nome || "Nenhuma vitrine"
  };

  const handleCreateVitrine = () => {
    navigate("/criar");
  };

  const handleViewVitrine = (slug: string) => {
    navigate(`/${slug}`);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Olá, {user.nome}!</h1>
          <p className="text-slate-600 mt-2">Gerencie suas vitrines e acompanhe o desempenho</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="vitrines" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Minhas Vitrines
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Vitrines</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vitrines.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{vitrines.length > 0 ? '1' : '0'} desde o último mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vitrines.reduce((total, vitrine) => total + (vitrine.produtos?.length || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Máximo 5 por vitrine
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% desde a semana passada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% desde o último mês
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Vitrines */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Vitrines</CardTitle>
                <CardDescription>
                  Vitrines criadas recentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : vitrines.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vitrines.slice(0, 6).map((vitrine) => (
                      <div key={vitrine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-900">{vitrine.nome}</h3>
                          <Badge variant="secondary">{vitrine.produtos?.length || 0} produtos</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{vitrine.descricao}</p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewVitrine(vitrine.slug)}
                            className="flex-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Ver Vitrine
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma vitrine ainda</h3>
                    <p className="text-gray-500 mb-4">Crie sua primeira vitrine para começar a vender</p>
                    <Button onClick={handleCreateVitrine}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Vitrine
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Minhas Vitrines Tab */}
          <TabsContent value="vitrines" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Minhas Vitrines</h2>
              <Button onClick={handleCreateVitrine}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Vitrine
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : vitrines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vitrines.map((vitrine) => (
                  <Card key={vitrine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {vitrine.imagem_capa && (
                      <div className="aspect-video bg-slate-200">
                        <img 
                          src={vitrine.imagem_capa} 
                          alt={vitrine.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start">
                        <span>{vitrine.nome}</span>
                        <Badge variant="secondary">{vitrine.produtos?.length || 0}/5</Badge>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {vitrine.descricao}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewVitrine(vitrine.slug)}
                          className="flex-1"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver Vitrine
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/vitrine/${vitrine.slug}/editar`)}
                          className="flex-1"
                        >
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma vitrine criada</h3>
                  <p className="text-gray-500 text-center mb-6">
                    Crie sua primeira vitrine e comece a mostrar seus produtos para o mundo
                  </p>
                  <Button onClick={handleCreateVitrine}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Minha Primeira Vitrine
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Todas as suas vitrines
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Cliques em Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.totalClicks}</div>
                  <p className="text-xs text-muted-foreground">
                    WhatsApp abertos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Cliques / Visualizações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Vitrine Mais Vista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{analyticsData.topVitrine}</div>
                  <p className="text-xs text-muted-foreground">
                    Maior engajamento
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance por Vitrine */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Vitrine</CardTitle>
                <CardDescription>
                  Métricas detalhadas de cada vitrine
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vitrines.length > 0 ? (
                  <div className="space-y-4">
                    {vitrines.map((vitrine) => (
                      <div key={vitrine.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{vitrine.nome}</h3>
                          <p className="text-sm text-muted-foreground">{vitrine.produtos?.length || 0} produtos</p>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{Math.floor(Math.random() * 500) + 100}</div>
                            <div className="text-muted-foreground">Visualizações</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{Math.floor(Math.random() * 50) + 5}</div>
                            <div className="text-muted-foreground">Cliques</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{(Math.random() * 10 + 2).toFixed(1)}%</div>
                            <div className="text-muted-foreground">Conversão</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sem dados ainda</h3>
                    <p className="text-gray-500">Crie vitrines para ver métricas de performance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}