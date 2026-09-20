"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { RoleKey } from "@/lib/roles";

const KEY = "bee-role";

interface RoleCtx {
  role: RoleKey;
  setRole: (r: RoleKey) => void;
  ready: boolean;
}

const Ctx = createContext<RoleCtx>({ role: "admin", setRole: () => {}, ready: false });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleKey>("admin");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as RoleKey | null;
      if (saved) setRoleState(saved);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setRole = (r: RoleKey) => {
    setRoleState(r);
    try {
      localStorage.setItem(KEY, r);
    } catch {
      /* ignore */
    }
  };

  return <Ctx.Provider value={{ role, setRole, ready }}>{children}</Ctx.Provider>;
}

export function useRole() {
  return useContext(Ctx);
}

/** Helper for the login page to set role before navigating. */
export function persistRole(r: RoleKey) {
  try {
    localStorage.setItem(KEY, r);
  } catch {
    /* ignore */
  }
}
