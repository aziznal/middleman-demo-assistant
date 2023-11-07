"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import SidebarLink from "@/components/ui/sidebar/sidebar-link";
import { useToast } from "@/components/ui/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();

  const supabase = createClientComponentClient();

  const { toast } = useToast();

  const logout = () => {
    supabase.auth.signOut();

    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

  return (
    <div className="flex">
      <div className="bg-slate-200 border-r-2 border-r-zinc-200 shrink-0 sticky top-0 h-[100vh] w-[350px] p-4 flex flex-col gap-4">
        <SidebarLink href="/browse-services">Browse Services</SidebarLink>

        {!session && (
          <>
            <SidebarLink href="/login">Login</SidebarLink>
            <SidebarLink href="/signup">Signup</SidebarLink>
          </>
        )}

        {session && (
          <>
            <SidebarLink href="/create-service">Create Service</SidebarLink>

            <div
              onClick={() => logout()}
              className="p-4 text-red-700 cursor-pointer hover:bg-slate-300 transition-all rounded-lg"
            >
              Logout
            </div>
          </>
        )}
      </div>

      <div className="flex-1 p-2">{children}</div>
    </div>
  );
};

export default Layout;
