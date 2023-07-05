"use client";
import React, { useEffect, useState } from "react";

type FooterProps = {};

export const Footer: React.FC<FooterProps> = ({}) => {
  const [bottomMarginNumber, setBottomMarginNumber] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const subscription = setInterval(() => {
      const bottomPadding =
        document.getElementById("routine-list")?.clientHeight;
      if (bottomPadding !== bottomMarginNumber) {
        setBottomMarginNumber(bottomPadding);
      }
    }, 5000);
    return () => clearInterval(subscription);
  }, []);

  return (
    <footer
      style={{
        marginBottom: !!bottomMarginNumber ? `${bottomMarginNumber}px` : "0px",
      }}
      className={"flex min-w-full justify-center bg-[#176B87] py-2"}
    >
      <a
        className={"text-[#DAFFFB]"}
        href={"https://github.com/ArnthorDadi/routine-builder"}
        target={"_blank"}
      >
        Made with ❤️, by <span className={"text-[#64CCC5]"}>@ArnthorDadi</span>
      </a>
    </footer>
  );
};
