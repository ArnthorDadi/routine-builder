"use client";

import { Elements } from "@src/elements/Elements";
import { CoPList } from "@components/CoPList";

export default function Vault() {
  return (
    <div>
      <p className={"text-xl text-white"}>Vault</p>
      <CoPList elementList={Elements.vault} />
    </div>
  );
}
