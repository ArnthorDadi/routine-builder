import { SessionProvider } from "next-auth/react";
import "@src/styles/globals.css";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
