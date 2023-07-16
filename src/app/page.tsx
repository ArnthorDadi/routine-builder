"use client";

import { ApparatusList } from "@src/elements/types";
import Link from "next/link";

export default function Home() {
  return (
    <div className={"flex flex-1 flex-col items-center justify-center"}>
      <div className={"flex flex-row flex-wrap justify-center gap-4 py-4"}>
        {ApparatusList.map((apparatus) => (
          <Link
            key={apparatus}
            className={
              "rounded-full bg-white/10 px-10 py-3 font-semibold text-accent no-underline transition hover:bg-white/20"
            }
            href={`/apparatus/${apparatus}`}
          >
            {apparatus.slice(0, 1).toUpperCase() +
              apparatus.slice(1).replaceAll("-", " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}
