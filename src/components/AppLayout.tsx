import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { vaultStore } from "@/stores/vaultStore";

export function AppLayout() {
  const { isOwner, activeVaultId } = useUserRole();

  const headerLabel = isOwner
    ? "ImageVault Platform"
    : vaultStore.getVaults().find((v) => v.id === activeVaultId)?.name ?? "ImageVault";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 shrink-0">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm text-muted-foreground">{headerLabel}</span>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
