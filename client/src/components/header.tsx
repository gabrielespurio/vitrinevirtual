import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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



  const handleConfigurations = () => {
    // Navegará para página de configurações quando criada
    navigate("/dashboard");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 h-8 px-2"
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(user.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-700 max-w-32 truncate">
                          {user.nome}
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.nome}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={handleConfigurations}
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Entrar</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}