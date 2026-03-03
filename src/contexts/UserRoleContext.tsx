import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "admin" | "supplier";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isSupplier: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole,
        isAdmin: role === "admin",
        isSupplier: role === "supplier",
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
