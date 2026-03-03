import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import Dashboard from "@/pages/Dashboard";
import ImageLibrary from "@/pages/ImageLibrary";
import ShareManager from "@/pages/ShareManager";
import BrandAssets from "@/pages/BrandAssets";
import UploadFlow from "@/pages/UploadFlow";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserRoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<ImageLibrary />} />
              <Route path="/upload" element={<UploadFlow />} />
              <Route path="/shares" element={<ShareManager />} />
              <Route path="/brand" element={<BrandAssets />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserRoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
