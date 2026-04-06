import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Vendas from "./pages/Vendas";
import VendasBR from "./pages/VendasBR";
import Upsell from "./pages/Upsell";
import UpsellBR from "./pages/UpsellBR";
import Obrigado from "./pages/Obrigado";
import ObrigadoBR from "./pages/ObrigadoBR";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      {/* Rota raiz — quiz bilíngue (detecta idioma automaticamente) */}
      <Route path={"/"} component={Quiz} />
      <Route path={"/quiz"} component={Quiz} />

      {/* Funil LATAM (Espanhol) */}
      <Route path={"/vendas"} component={Vendas} />
      <Route path={"/upsell"} component={Upsell} />
      <Route path={"/obrigado"} component={Obrigado} />

      {/* Funil Brasil (Português) */}
      <Route path={"/vendas-br"} component={VendasBR} />
      <Route path={"/upsell-br"} component={UpsellBR} />
      <Route path={"/obrigado-br"} component={ObrigadoBR} />

      {/* Admin e utilitários */}
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
