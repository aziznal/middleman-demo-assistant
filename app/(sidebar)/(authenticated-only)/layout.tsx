"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const { session } = useAuth();

  if (session === null) return redirect("/login");

  if (session === undefined) return <>Loading</>;

  return <>{children}</>;
};

export default Layout;
