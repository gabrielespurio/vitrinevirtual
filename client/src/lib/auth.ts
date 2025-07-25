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