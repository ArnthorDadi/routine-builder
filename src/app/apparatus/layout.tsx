"use client";

import React, { useContext } from "react";
import { cn } from "@src/utils/Utility";
import {
  RequirementGroupContext,
  RequirementGroupProvider,
} from "@src/app/apparatus/providers";
import { Breadcrumbs } from "@components/layout/Breadcrumbs";

export default function ApparatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequirementGroupProvider>
      <div className={"flex flex-row gap-7"}>
        <div className={"relative min-w-[132px]"}>
          <div className={"sticky top-24"}>
            <Breadcrumbs className={"mb-4"} />
            <ElementSearchBox />
          </div>
        </div>
        <div className={"flex-1"}>{children}</div>
      </div>
    </RequirementGroupProvider>
  );
}

type ElementSearchBoxProps = {};

const ElementSearchBox: React.FC<ElementSearchBoxProps> = ({}) => {
  const { I, II, III, IV, setI, setII, setIII, setIV } = useContext(
    RequirementGroupContext
  );
  return (
    <form className={"rounded border border-[#176B87] bg-[#001C30] p-4"}>
      <fieldset>
        <legend className={"text-white"}>Groups</legend>
        <div className={"my-2 h-px bg-[#176B87]"} />
        <Input
          label={"I"}
          checked={I}
          onChange={(e) => setI(e.target.checked)}
        />
        <Input
          label={"II"}
          checked={II}
          onChange={(e) => setII(e.target.checked)}
        />
        <Input
          label={"III"}
          checked={III}
          onChange={(e) => setIII(e.target.checked)}
        />
        <Input
          label={"IV"}
          checked={IV}
          onChange={(e) => setIV(e.target.checked)}
        />
      </fieldset>
    </form>
  );
};

type InputProps = {
  label: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  checked,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        className,
        "flex min-w-[100px] gap-2 rounded pl-2 hover:bg-white/20"
      )}
    >
      <input
        id={label}
        name={label}
        value={label}
        className={"bg-green-500 py-2 pl-4 text-white"}
        checked={checked}
        onChange={(e) => onChange?.(e)}
        type="checkbox"
      />
      <label
        htmlFor={label}
        className={"w-full select-none py-2 pr-2 text-white"}
      >
        {label}
      </label>
    </div>
  );
};
