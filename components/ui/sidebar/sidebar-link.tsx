"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

const SidebarLink = ({ href, children }: LinkProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "p-4 w-full transition-all rounded-lg flex items-center",
        isActive && "bg-slate-300 text-slate-800 font-bold",
        !isActive && "hover:bg-slate-300"
      )}
    >
      {children}
    </Link>
  );
};

SidebarLink.displayName = "SidebarLink";

export default SidebarLink;
