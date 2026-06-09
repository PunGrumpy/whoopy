import type { ReactNode } from "react";

import { Menu } from "@/components/menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <SidebarProvider>
    <Menu />
    <SidebarInset>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col">{children}</div>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export default DashboardLayout;
