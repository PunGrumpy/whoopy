import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Menu } from "@/components/menu";
import { TimeRangeProvider } from "@/components/time-range/context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <Menu />
      <SidebarInset>
        <TimeRangeProvider>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col">{children}</div>
            </div>
          </div>
        </TimeRangeProvider>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
