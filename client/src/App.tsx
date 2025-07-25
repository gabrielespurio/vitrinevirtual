import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import CreateVitrine from "@/pages/create-vitrine";
import VitrinePublic from "@/pages/vitrine-public";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={LoginPage} />
        <Route path="/criar" component={CreateVitrine} />
        <Route path="/:slug" component={VitrinePublic} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
