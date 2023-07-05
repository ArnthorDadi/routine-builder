import React, { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@src/utils/Utility";

type NavbarLinkProps = (
  | Omit<ComponentProps<typeof Link>, "href" | "className">
  | Omit<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "className"
    >
) & {
  href?: string;
  className?: string;
};
export const NavbarLink: React.FC<NavbarLinkProps> = ({
  className,
  href,
  ...props
}) => {
  if (!href) {
    return (
      <button
        className={cn(
          className,
          "select-none rounded-full px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        )}
        {...(props as React.DetailedHTMLProps<
          React.ButtonHTMLAttributes<HTMLButtonElement>,
          HTMLButtonElement
        >)}
      />
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        className,
        "select-none rounded-full px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      )}
      {...(props as Omit<ComponentProps<typeof Link>, "href" | "className">)}
    />
  );
};
