"use client";

import { Elements } from "@src/elements/Elements";
import { CoPList } from "@components/CoPList";

export default function Floor() {
  return (
    <div>
      <CoPList elementList={Elements.floor} />
    </div>
  );
}
