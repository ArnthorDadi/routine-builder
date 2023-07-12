"use client";

import React from "react";

export default function RoutinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex min-h-full min-w-full flex-1 flex-col"}>
      {children}
    </div>
  );
}
