import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { setCurrentVault } from "@/stores/vaultScope";

export type UserRole = "owner" | "admin" | "supplier";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOwner: boolean;
  isAdmin: boolean;
  isSupplier: boolean;
  activeVaultId: string | null;
  setActiveVaultId: (id: string | null) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");
  const [activeVaultId, setActiveVaultIdState] = useState<string | null>("v1");

  const setActiveVaultId = useCallback((id: string | null) => {
    setActiveVaultIdState(id);
    if (id) {
      setCurrentVault(id);
    }
  }, []);

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole,
        isOwner: role === "owner",
        isAdmin: role === "admin",
        isSupplier: role === "supplier",
        activeVaultId,
        setActiveVaultId,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const ctx = useContext(UserRoleContext);
  if (!ctx) throw new Error("useUserRole must be used within UserRoleProvider");
  return ctx;
}
