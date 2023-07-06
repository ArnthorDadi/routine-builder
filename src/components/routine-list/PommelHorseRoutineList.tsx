"use client";

import React from "react";
import {
  ElementTypeWithId,
  ProcessedPommelHorseElementType,
} from "@src/elements/types";
import { useProcessPommelHorseRoutine } from "@components/routine-list/utlis";
import { cn } from "@src/utils/Utility";
import Image from "next/image";
import { api } from "@src/utils/api";

type PommelHorseRoutineListProps = {
  routine: ElementTypeWithId[];
  className?: string;
};

export const PommelHorseRoutineList: React.FC<PommelHorseRoutineListProps> = ({
  routine,
  className,
}) => {
  const saveRoutine = api.routine.savePommelHorseRoutine.useMutation();
  const { UIRoutine, dScore } = useProcessPommelHorseRoutine(routine);
  return (
    <div
      id={"routine-list"}
      style={{ borderTop: "2px solid #64CCC5" }}
      className={cn(
        className,
        "flex flex-col gap-2 rounded-t-md bg-[#001C30] px-8 py-4"
      )}
    >
      <div className={"flex flex-row items-center justify-between"}>
        <button
          onClick={async () =>
            await saveRoutine.mutate({ routine: UIRoutine, dScore })
          }
          type="button"
          className="rounded-lg border-2 border-[#64CCC5] px-5 py-2.5 text-sm font-bold text-[#64CCC5] transition-all hover:bg-[#64CCC5] hover:text-[#001C30] focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Save
        </button>
        <p className={"text-right text-xl font-bold text-white"}>D: {dScore}</p>
      </div>

      <div className={"flex max-w-[100%] flex-row gap-4 overflow-auto"}>
        {UIRoutine.map((element) => (
          <PommelHorseRoutineItem key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
};

type PommelHorseRoutineItemProps = {
  element: ProcessedPommelHorseElementType;
};

const IMG_WIDTH = 375;
const IMG_ASPECT_RATIO = 1;

export const PommelHorseRoutineItem: React.FC<PommelHorseRoutineItemProps> = ({
  element,
}) => {
  return (
    <div className={"min-w-[14rem]"}>
      <p className={"text-center text-white"}>
        {element.element_alphabetic_value}: {element.element_numeric_value}
      </p>
      <Image
        className={"aspect-square w-auto border-2 border-white bg-white p-2"}
        key={`${element?.id}`}
        src={element?.img}
        width={IMG_WIDTH}
        height={IMG_WIDTH * IMG_ASPECT_RATIO}
        alt={"pommel horse element"}
      />
    </div>
  );
};
