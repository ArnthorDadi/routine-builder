"use client";
import React from "react";

type FooterProps = {};

export const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <footer className={"flex min-w-full justify-center bg-[#176B87] py-2"}>
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
