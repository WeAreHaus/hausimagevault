import { LayoutDashboard, Images, Share2, FolderOpen, Palette, Camera, Upload, ShieldCheck, Truck, Settings2 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Image Library", url: "/library", icon: Images },
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "Share Manager", url: "/shares", icon: Share2 },
  { title: "Brand Assets", url: "/brand", icon: Palette },
  { title: "Settings", url: "/settings", icon: Settings2 },
];

const supplierItems = [
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "Image Library", url: "/library", icon: Images },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { role, setRole, isAdmin } = useUserRole();

  const items = isAdmin ? adminItems : supplierItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              {!collapsed && <span className="font-semibold tracking-tight">ImageVault</span>}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-accent/60"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <div className="px-3 py-2 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Role</p>
            <Select value={role} onValueChange={(v) => setRole(v as "admin" | "supplier")}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Admin / Editor</span>
                </SelectItem>
                <SelectItem value="supplier">
                  <span className="flex items-center gap-1.5"><Truck className="h-3 w-3" /> Supplier / Photographer</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
