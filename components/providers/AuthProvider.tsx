"use client";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Session } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Create the context with a default value
const AuthContext = createContext<{
  /** `null` means we checked for session and found none, `undefined` means we still haven't checked for session*/
  session: Session | null | undefined;
  setSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>;
}>({
  session: null,
  setSession: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("setting session");
      setSession(session);
    });
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
