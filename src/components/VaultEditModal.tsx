import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { vaultStore, type Vault } from "@/stores/vaultStore";
import { toast } from "sonner";

interface VaultEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vault?: Vault | null; // null = create mode
}

export default function VaultEditModal({ open, onOpenChange, vault }: VaultEditModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const isEdit = !!vault;

  useEffect(() => {
    if (open) {
      setName(vault?.name ?? "");
      setDomain(vault?.domain ?? "");
    }
  }, [open, vault]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    if (isEdit && vault) {
      vaultStore.updateVault(vault.id, {
        name: trimmedName,
        domain: domain.trim(),
        avatarLetter: trimmedName[0].toUpperCase(),
      });
      toast.success("Vault updated");
    } else {
      vaultStore.addVault({
        name: trimmedName,
        domain: domain.trim(),
        status: "draft",
        avatarLetter: trimmedName[0].toUpperCase(),
      });
      toast.success("Vault created");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Vault" : "Create New Vault"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="vault-name">Name</Label>
            <Input id="vault-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Company" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vault-domain">Domain</Label>
            <Input id="vault-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Create Vault"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
