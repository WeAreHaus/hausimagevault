import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";
import type { UserRole } from "@/contexts/UserRoleContext";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pending?: boolean;
}

const defaultUsers: MockUser[] = [
  { id: "1", name: "Anna Lindgren", email: "anna@example.com", role: "admin" },
  { id: "2", name: "Erik Holm", email: "erik@example.com", role: "supplier" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<MockUser[]>(defaultUsers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("supplier");

  const handleInvite = () => {
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Enter an email address");
      return;
    }
    if (users.some((u) => u.email === email)) {
      toast.error("This email has already been added");
      return;
    }
    setUsers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: email.split("@")[0], email, role: inviteRole, pending: true },
    ]);
    setInviteEmail("");
    toast.success(`Invite sent to ${email}`);
  };

  const handleRemove = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User removed");
  };

  return (
    <div className="space-y-6">
      {/* Role descriptions */}
      <div className="rounded-md border bg-muted/50 p-4 space-y-1.5">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Admin</span> — Full access: manage images, buckets, shares, settings and users.
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Supplier</span> — Can upload images and edit metadata, but cannot manage settings or users.
        </p>
      </div>

      <Separator />

      {/* User list */}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded-md border px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              {user.pending && <Badge variant="outline" className="text-xs">Pending</Badge>}
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize text-xs">
                {user.role}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemove(user.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Invite form */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5 text-sm">
          <UserPlus className="h-3.5 w-3.5" /> Invite User
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="email@example.com"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          />
          <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleInvite}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
