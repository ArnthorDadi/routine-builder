"use client";

import { Elements } from "@src/elements/Elements";
import { CoPList } from "@components/CoPList";

export default function Rings() {
  return (
    <div>
      <p className={"text-xl text-white"}>Rings</p>
      <CoPList elementList={Elements.rings} />
    </div>
  );
}
