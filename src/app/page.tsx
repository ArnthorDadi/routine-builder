"use client";

import { ApparatusList } from "@src/elements/types";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className={"flex flex-1 flex-col items-center justify-center"}>
      <div className={"flex flex-row flex-wrap justify-center gap-4 py-4"}>
        {ApparatusList.map((apparatus) => (
          <button
            className={
              "rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            }
            onClick={() => router.push(`/apparatus/${apparatus}`)}
          >
            {apparatus.slice(0, 1).toUpperCase() +
              apparatus.slice(1).replaceAll("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
