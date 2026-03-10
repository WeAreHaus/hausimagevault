import { useState, useSyncExternalStore } from "react";
import { vaultStore, type Vault } from "@/stores/vaultStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, ArrowRight, LayoutGrid, List, Building2, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import VaultEditModal from "@/components/VaultEditModal";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVault, setEditingVault] = useState<Vault | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vault | null>(null);

  const openVault = (vault: Vault) => {
    setActiveVaultId(vault.id);
    setRole("admin");
    navigate("/");
  };

  const handleEdit = (vault: Vault) => {
    setEditingVault(vault);
    setEditModalOpen(true);
  };

  const handleCreate = () => {
    setEditingVault(null);
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      vaultStore.deleteVault(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

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
        <Button className="gap-1.5" onClick={handleCreate}>
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

              <div className="flex items-center justify-between pt-1 border-t">
                <span className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(vault.updatedAt), { addSuffix: true })}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => handleEdit(vault)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Delete" onClick={() => setDeleteTarget(vault)}>
                    <Trash2 className="h-3.5 w-3.5" />
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
              <Badge variant="outline" className={`shrink-0 text-[11px] capitalize ${statusColors[vault.status]}`}>
                {vault.status}
              </Badge>
              <span className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">
                {formatDistanceToNow(new Date(vault.updatedAt), { addSuffix: true })}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(vault)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(vault)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
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

      <VaultEditModal open={editModalOpen} onOpenChange={setEditModalOpen} vault={editingVault} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this vault and all its data (images, buckets, shares, etc.). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Vault
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
