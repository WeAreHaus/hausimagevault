import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ImageLibrary from "@/pages/ImageLibrary";
import ShareManager from "@/pages/ShareManager";
import PublicPagePreview from "@/pages/PublicPagePreview";
import BrandAssets from "@/pages/BrandAssets";
import UploadFlow from "@/pages/UploadFlow";
import Settings from "@/pages/Settings";
import VaultManager from "@/pages/VaultManager";
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
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<ImageLibrary />} />
              <Route path="/upload" element={<UploadFlow />} />
              <Route path="/shares" element={<ShareManager />} />
              <Route path="/brand" element={<BrandAssets />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/vaults" element={<VaultManager />} />
              <Route path="/users" element={<div className="p-8"><h1 className="text-2xl font-semibold">Users</h1><p className="text-muted-foreground mt-2">User management coming soon.</p></div>} />
              <Route path="/platform-settings" element={<div className="p-8"><h1 className="text-2xl font-semibold">Platform Settings</h1><p className="text-muted-foreground mt-2">Platform configuration coming soon.</p></div>} />
            </Route>
            <Route path="/public/:slug" element={<PublicPagePreview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserRoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
