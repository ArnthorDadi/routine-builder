"use client";

import React, { useEffect, useState } from "react";
import { eventEmitter, EventType } from "@components/layout/utils/Emiter";

type FooterProps = {};

export const Footer: React.FC<FooterProps> = ({}) => {
  const [marginBottom, setMarginBottom] = useState(0);
  useEffect(() => {
    eventEmitter.addEventListener(EventType.MarginBottom, () =>
      setMarginBottom(eventEmitter.getMarginBottom())
    );
  }, []);

  return (
    <footer
      style={{ marginBottom }}
      className={"flex min-w-full justify-center bg-[#176B87] py-2"}
    >
      <a
        className={"text-neutral"}
        href={"https://github.com/ArnthorDadi/routine-builder"}
        target={"_blank"}
      >
        Made with ❤️, by <span className={"text-accent"}>@ArnthorDadi</span>
      </a>
    </footer>
  );
};
