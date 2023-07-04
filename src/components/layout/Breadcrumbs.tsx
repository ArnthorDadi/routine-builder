"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@src/utils/Utility";

export const Breadcrumbs: React.FC<{ className?: string }> = ({
  className,
}) => {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <p className={cn(className, "text-sm font-normal text-[#DAFFFB]")}>
      {pathname}
    </p>
  );
};
