"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Apparatus, ApparatusList } from "@src/elements/types";
import { Page } from "@src/utils/Page";
import { cn } from "@src/utils/Utility";
import { usePathname } from "next/navigation";

type NavbarProps = {
  className?: string;
};

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const selectedApparatus = useGetApparatusSelected();

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
            key={apparatus}
            className={cn(
              "rounded-full px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20",
              selectedApparatus === apparatus && "bg-white/10"
            )}
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

function useGetApparatusSelected() {
  const pathname = usePathname();

  const [selectedApparatus, setSelectedApparatus] = useState<
    Apparatus | undefined
  >(undefined);

  useEffect(() => {
    const splitPathname = pathname?.split("/");
    const lastPathname = splitPathname?.[splitPathname?.length - 1];

    switch (lastPathname) {
      case Apparatus.floor:
        setSelectedApparatus(Apparatus.floor);
        break;
      case Apparatus.pommel_horse:
        setSelectedApparatus(Apparatus.pommel_horse);
        break;
      case Apparatus.rings:
        setSelectedApparatus(Apparatus.rings);
        break;
      case Apparatus.vault:
        setSelectedApparatus(Apparatus.vault);
        break;
      case Apparatus.parallel_bars:
        setSelectedApparatus(Apparatus.parallel_bars);
        break;
      case Apparatus.high_bar:
        setSelectedApparatus(Apparatus.high_bar);
        break;
      default:
        setSelectedApparatus(undefined);
        break;
    }
  }, [pathname]);
  return selectedApparatus;
}
