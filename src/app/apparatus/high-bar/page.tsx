"use client";

import { Elements } from "@src/elements/Elements";
import { CoPList } from "@components/CoPList";

export default function HighBar() {
  return (
    <div>
      <p className={"text-xl text-white"}>High Bar</p>
      <CoPList elementList={Elements.high_bar} />
    </div>
  );
}
