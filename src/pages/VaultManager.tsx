import { useState, useSyncExternalStore } from "react";
import { vaultStore, type Vault } from "@/stores/vaultStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, ArrowRight, LayoutGrid, List, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";

const statusColors: Record<Vault["status"], string> = {
  live: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  preview: "bg-amber-500/15 text-amber-700 border-amber-200",
  draft: "bg-muted text-muted-foreground border-border",
};

export default function VaultManager() {
  const vaults = useSyncExternalStore(vaultStore.subscribe, vaultStore.getSnapshot);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { setRole, setActiveVaultId } = useUserRole();

  const openVault = (vault: Vault) => {
    setActiveVaultId(vault.id);
    setRole("admin");
    navigate("/");
  };
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = vaults.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vaults</h1>
          <p className="text-muted-foreground mt-1">Manage customer ImageVault instances</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" /> Create New Vault
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search vaults…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex border rounded-md">
          <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vault) => (
            <div key={vault.id} className="rounded-xl border bg-card p-5 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                  {vault.avatarLetter}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{vault.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{vault.domain}</p>
                </div>
                <Badge variant="outline" className={`shrink-0 text-[11px] capitalize ${statusColors[vault.status]}`}>
                  {vault.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {vault.languages.map((l) => (
                  <Badge key={l} variant="secondary" className="text-[10px] px-1.5 py-0">{l}</Badge>
                ))}
                {vault.integrations.map((i) => (
                  <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">{i}</Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t">
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(vault.updatedAt), { addSuffix: true })}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Preview">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => openVault(vault)}>
                    Open <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {filtered.map((vault) => (
            <div key={vault.id} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                {vault.avatarLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{vault.name}</p>
                <p className="text-sm text-muted-foreground truncate">{vault.domain}</p>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1">
                {vault.languages.map((l) => (
                  <Badge key={l} variant="secondary" className="text-[10px] px-1.5 py-0">{l}</Badge>
                ))}
              </div>
              <Badge variant="outline" className={`shrink-0 text-[11px] capitalize ${statusColors[vault.status]}`}>
                {vault.status}
              </Badge>
              <span className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">
                {formatDistanceToNow(new Date(vault.updatedAt), { addSuffix: true })}
              </span>
              <Button variant="ghost" size="sm" className="gap-1 text-xs shrink-0" onClick={() => openVault(vault)}>
                Open <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No vaults found.</p>
        </div>
      )}
    </div>
  );
}
