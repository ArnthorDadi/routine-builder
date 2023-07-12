"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Apparatus, ApparatusList } from "@src/elements/types";
import { Page } from "@src/utils/Page";
import { cn } from "@src/utils/Utility";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Session } from "next-auth";
import { Spinner } from "@components/Spinner";
import { NavbarLink } from "@components/layout/utils/NavbarLink";

type NavbarProps = {
  className?: string;
};

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav
      style={{ borderBottom: "1px solid #176B87" }}
      className={cn(
        "flex flex-row justify-between bg-background px-8 py-4",
        className
      )}
    >
      <Link
        href={Page.Home}
        className={
          "self-center whitespace-nowrap text-2xl font-semibold text-accent"
        }
      >
        Routine Builder
      </Link>
      <div className={"flex flex-row gap-4"}>
        <ApparatusLinkList className={"flex flex-row gap-4"} />
        <div className={"h-full w-px bg-[#176B87]"} />
        <NavbarAuthStatus />
      </div>
    </nav>
  );
};

type ApparatusLinkListProps = { className?: string };
const ApparatusLinkList: React.FC<ApparatusLinkListProps> = ({ className }) => {
  const selectedApparatus = useGetApparatusSelected();

  return (
    <div className={cn(className)}>
      {ApparatusList.map((apparatus) => (
        <NavbarLink
          key={apparatus}
          href={`/apparatus/${apparatus}`}
          className={cn(selectedApparatus === apparatus && "bg-white/10")}
        >
          {apparatus.charAt(0).toUpperCase() +
            apparatus?.slice(1)?.replaceAll("-", " ")}
        </NavbarLink>
      ))}
    </div>
  );
};

type NavbarAuthStatusProps = {};
export const NavbarAuthStatus: React.FC<NavbarAuthStatusProps> = ({}) => {
  const { data, status } = useSession();

  return (
    <>
      {status === "unauthenticated" ? (
        <button
          onClick={() => signIn()}
          className={cn(
            "select-none rounded-full px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          )}
        >
          Sign in
        </button>
      ) : null}
      {status === "authenticated" ? <UserMenu session={data} /> : null}
      {status === "loading" ? <Spinner /> : null}
    </>
  );
};

type UserMenuProps = {
  session: Session;
};

const UserMenu: React.FC<UserMenuProps> = ({ session }) => {
  const selectedApparatus = useGetApparatusSelected();
  return (
    <div className={"flex items-center justify-between gap-4"}>
      <NavbarLink
        href={Page.Routines}
        className={cn(
          selectedApparatus === "routines" && "bg-white/10",
          "text-white"
        )}
      >
        My routines
      </NavbarLink>
      <p className={"mr-4 text-white"}>@{session.user?.name}</p>
      <Image
        className="rounded-full border-2 border-neutral"
        width={30}
        height={30}
        src={`https://api.dicebear.com/5.x/identicon/svg?seed=${session.user?.email}&scale=75`}
        alt="user photo"
      />
      <NavbarLink className={"text-white"} onClick={() => signOut()}>
        Sign out
      </NavbarLink>
    </div>
  );
};

function useGetApparatusSelected() {
  const pathname = usePathname();

  const [selectedApparatus, setSelectedApparatus] = useState<
    Apparatus | "routines" | undefined
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
      case "routines":
        setSelectedApparatus("routines");
        break;
      default:
        setSelectedApparatus(undefined);
        break;
    }
  }, [pathname]);
  return selectedApparatus;
}
