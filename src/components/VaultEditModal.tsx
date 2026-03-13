import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [status, setStatus] = useState<Vault["status"]>("draft");
  const isEdit = !!vault;

  useEffect(() => {
    if (open) {
      setName(vault?.name ?? "");
      setDomain(vault?.domain ?? "");
      setStatus(vault?.status ?? "draft");
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
        status,
        avatarLetter: trimmedName[0].toUpperCase(),
      });
      toast.success("Vault updated");
    } else {
      vaultStore.addVault({
        name: trimmedName,
        domain: domain.trim(),
        status,
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
          <div className="space-y-2">
            <Label htmlFor="vault-status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Vault["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="preview">Preview</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vault-domain">Domain</Label>
            <Input id="vault-domain" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
          </div>
          {isEdit && vault?.slug && (
            <div className="space-y-2">
              <Label htmlFor="vault-slug">S3 Folder</Label>
              <Input id="vault-slug" value={vault.slug} readOnly className="bg-muted text-muted-foreground cursor-default" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Create Vault"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
