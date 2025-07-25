import { apiRequest } from "./queryClient";
import type { Login, InsertUsuario } from "@shared/schema";

export interface User {
  id: string;
  nome: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  sessionId: string;
}

class AuthManager {
  private sessionId: string | null = null;
  private user: User | null = null;

  constructor() {
    // Carregar sessão do localStorage
    this.sessionId = localStorage.getItem('sessionId');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch {
        this.user = null;
      }
    }
  }

  async login(credentials: Login): Promise<User> {
    const response = await apiRequest("POST", "/api/login", credentials);
    const data: AuthResponse = await response.json();
    
    this.sessionId = data.sessionId;
    this.user = data.user;
    
    localStorage.setItem('sessionId', data.sessionId);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  }

  // Método para verificar se a sessão ainda é válida
  async validateSession(): Promise<boolean> {
    if (!this.sessionId) return false;
    
    try {
      const response = await fetch('/api/vitrines/user', {
        headers: {
          'x-session-id': this.sessionId
        }
      });
      
      if (response.status === 401) {
        // Sessão expirada, limpar dados
        this.clearSession();
        return false;
      }
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private clearSession() {
    this.sessionId = null;
    this.user = null;
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
  }

  // Método público para atualizar a sessão
  updateSession(sessionId: string, user: User) {
    this.sessionId = sessionId;
    this.user = user;
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('user', JSON.stringify(user));
  }

  async register(userData: InsertUsuario): Promise<User> {
    const response = await apiRequest("POST", "/api/register", userData);
    const data: AuthResponse = await response.json();
    
    this.sessionId = data.sessionId;
    this.user = data.user;
    
    localStorage.setItem('sessionId', data.sessionId);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  }

  async logout(): Promise<void> {
    if (this.sessionId) {
      await apiRequest("POST", "/api/logout", {});
    }
    
    this.sessionId = null;
    this.user = null;
    
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.sessionId !== null && this.user !== null;
  }
}

export const authManager = new AuthManager();