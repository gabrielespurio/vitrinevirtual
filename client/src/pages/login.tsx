import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { loginSchema, insertUsuarioSchema, type Login, type InsertUsuario } from "@shared/schema";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const loginForm = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const registerForm = useForm<InsertUsuario>({
    resolver: zodResolver(insertUsuarioSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
    },
  });

  const handleLogin = async (data: Login) => {
    try {
      await authManager.login(data);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao Flash Vitrine",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: InsertUsuario) => {
    try {
      await authManager.register(data);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Flash Vitrine",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-900">
            {isLogin ? "Entrar" : "Criar Conta"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Acesse sua conta do Flash Vitrine" 
              : "Crie sua conta e comece a vender"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  {...loginForm.register("senha")}
                />
                {loginForm.formState.errors.senha && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.senha.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  {...registerForm.register("nome")}
                />
                {registerForm.formState.errors.nome && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.nome.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  {...registerForm.register("senha")}
                />
                {registerForm.formState.errors.senha && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.senha.message}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          )}
          
          <Separator />
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin 
                ? "Não tem uma conta? Criar conta" 
                : "Já tem uma conta? Entrar"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}