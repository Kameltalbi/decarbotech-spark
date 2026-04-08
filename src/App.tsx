import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import RSE from "./pages/RSE.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./components/AppLayout.tsx";
import Dashboard from "./pages/app/Dashboard.tsx";
import Environnement from "./pages/app/Environnement.tsx";
import Social from "./pages/app/Social.tsx";
import Gouvernance from "./pages/app/Gouvernance.tsx";
import Rapports from "./pages/app/Rapports.tsx";
import Parametres from "./pages/app/Parametres.tsx";
import PlanAction from "./pages/app/PlanAction.tsx";
import Onboarding from "./pages/Onboarding.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rse" element={<RSE />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="environnement" element={<Environnement />} />
              <Route path="social" element={<Social />} />
              <Route path="gouvernance" element={<Gouvernance />} />
              <Route path="rapports" element={<Rapports />} />
              <Route path="plan-action" element={<PlanAction />} />
              <Route path="parametres" element={<Parametres />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
