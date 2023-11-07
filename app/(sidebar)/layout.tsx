import SidebarLink from "@/components/ui/sidebar/sidebar-link";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex">
      <div className="bg-slate-200 border-r-2 border-r-zinc-200 shrink-0 sticky top-0 h-[100vh] w-[350px] p-4 flex flex-col gap-4">
        <SidebarLink href="/create-service">Create Service</SidebarLink>
        <SidebarLink href="/browse-services">Browse Services</SidebarLink>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
