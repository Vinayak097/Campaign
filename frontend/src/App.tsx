import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import CampaignsPage from "@/pages/CampaignsPage";
import CampaignFormPage from "@/pages/CampaignFormPage";
import MessageGeneratorPage from "@/pages/MessageGeneratorPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/new" element={<CampaignFormPage />} />
            <Route path="campaigns/edit/:id" element={<CampaignFormPage />} />
            <Route path="message-generator" element={<MessageGeneratorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;