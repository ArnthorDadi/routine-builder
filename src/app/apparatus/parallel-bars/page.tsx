"use client";

import { Elements } from "@src/elements/Elements";
import { CoPList } from "@components/CoPList";

export default function ParallelBars() {
  return (
    <div>
      <p className={"text-xl text-white"}>Parallel Bars</p>
      <CoPList elementList={Elements.parallel_bars} />
    </div>
  );
}
