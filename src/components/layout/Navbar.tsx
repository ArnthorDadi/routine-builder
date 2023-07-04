"use client";

import React from "react";
import Link from "next/link";
import { ApparatusList } from "@src/elements/types";
import { Page } from "@src/utils/Page";
import { cn } from "@src/utils/Utility";

type NavbarProps = {
  className?: string;
};

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav
      style={{ borderBottom: "1px solid #176B87" }}
      className={cn(
        className,
        "flex flex-row justify-between bg-[#001C30] px-8 py-4"
      )}
    >
      <Link
        href={Page.Home}
        className={
          "self-center whitespace-nowrap text-2xl font-semibold text-[#DAFFFB]"
        }
      >
        Routine Builder
      </Link>
      <div className={"flex flex-row gap-4"}>
        {ApparatusList.map((apparatus) => (
          <a
            className={
              "rounded-full px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            }
            href={`/apparatus/${apparatus}`}
          >
            {apparatus.slice(0, 1).toUpperCase() +
              apparatus.slice(1).replaceAll("-", " ")}
          </a>
        ))}
      </div>
    </nav>
  );
};
