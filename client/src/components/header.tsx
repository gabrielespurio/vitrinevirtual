import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute } from "wouter";

export function Header() {
  const [, navigate] = useLocation();
  const [isHome] = useRoute("/");
  const { toast } = useToast();
  const user = authManager.getUser();
  const isAuthenticated = authManager.isAuthenticated();

  const handleLogout = async () => {
    try {
      await authManager.logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleCreateVitrine = () => {
    if (isAuthenticated) {
      navigate("/criar");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-primary cursor-pointer hover:text-blue-600 transition-colors"
            >
              Flash Vitrine
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Links de navegação apenas na home */}
            {isHome && (
              <div className="hidden md:flex items-center space-x-6">
                <a href="#como-funciona" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Como Funciona
                </a>
                <a href="#exemplo" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Exemplos
                </a>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{user.nome}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCreateVitrine}
                  >
                    Criar Vitrine
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogin}
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Entrar</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreateVitrine}
                  >
                    Criar Vitrine
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}