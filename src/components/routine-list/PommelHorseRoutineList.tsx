"use client";

import React, { useEffect, useState } from "react";
import {
  ElementTypeWithId,
  ProcessedPommelHorseElementType,
} from "@src/elements/types";
import { cn } from "@src/utils/Utility";
import Image from "next/image";
import { api } from "@src/utils/api";
import { SuccessToast } from "@components/toast/Toast";
import { eventEmitter } from "@components/layout/utils/Emiter";
import { processPommelHorseRoutine } from "@src/utils/dScore";

type PommelHorseRoutineListProps = {
  routine: ProcessedPommelHorseElementType[];
  className?: string;
};

export const PommelHorseRoutineList: React.FC<PommelHorseRoutineListProps> = ({
  routine,
  className,
}) => {
  const saveRoutine = api.routine.savePommelHorseRoutine.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [dScore, setDScore] = useState(0);
  const [processedRoutine, setProcessedRoutine] = useState<
    ProcessedPommelHorseElementType[]
  >([]);

  useEffect(() => {
    const { routine: processedRoutine, dScore } =
      processPommelHorseRoutine(routine);
    setProcessedRoutine(processedRoutine);
    setDScore(dScore);
  }, [routine]);

  useEffect(() => {
    const routineDivHeight =
      document.getElementById("routine-list")?.clientHeight ?? 0;
    eventEmitter.setMarginBottom(routineDivHeight);

    return () => eventEmitter.setMarginBottom(0);
  }, [isOpen]);

  return (
    <div
      id={"routine-list"}
      style={{ borderTop: "2px solid #64CCC5" }}
      className={cn(
        className,
        "flex flex-col gap-2 rounded-t-md bg-[#001C30] px-8 py-4"
      )}
    >
      <button
        className={cn(isOpen ? "mb-2" : "", "flex flex-row items-center gap-4")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          data-accordion-icon
          className={cn(
            isOpen ? "rotate-180" : "rotate-90",
            "h-3 w-3 shrink-0 transition-all"
          )}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="#64CCC5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5 5 1 1 5"
          />
        </svg>
        <p className={"text-xl text-accent"}>Pommel Horse</p>
      </button>
      <div className={cn(!isOpen ? "hidden" : "")}>
        <div className={"flex flex-row items-center justify-between"}>
          <button
            onClick={async () => {
              // await saveRoutine.mutate({ routine: processedRoutine, dScore });
              SuccessToast("Saved Pommel Horse Routine!", {
                toastId: "CreatedPommelHorseRoutine",
              });
            }}
            className="rounded-lg border-2 border-[#64CCC5] px-5 py-2.5 text-sm font-bold text-[#64CCC5] transition-all hover:bg-[#64CCC5] hover:text-[#001C30] focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Save
          </button>
          <p className={"text-right text-xl font-bold text-white"}>
            D: {dScore}
          </p>
        </div>

        <div className={"flex max-w-[100%] flex-row gap-4 overflow-auto"}>
          {processedRoutine.map((element) => (
            <PommelHorseRoutineItem key={element.id} element={element} />
          ))}
        </div>
      </div>
    </div>
  );
};

type PommelHorseRoutineItemProps = {
  element: ProcessedPommelHorseElementType;
};

const IMG_WIDTH = 375;
export const IMG_ASPECT_RATIO = 374 / 352;

export const PommelHorseRoutineItem: React.FC<PommelHorseRoutineItemProps> = ({
  element,
}) => {
  return (
    <div className={"min-w-[14rem]"}>
      <p className={"select-none text-center text-white"}>
        {element.element_alphabetic_value}: {element.element_numeric_value}
      </p>
      <Image
        className={
          "aspect-square w-auto select-none border-2 border-white bg-white p-2"
        }
        key={`${element?.id}`}
        src={element?.img}
        width={IMG_WIDTH}
        height={IMG_WIDTH * IMG_ASPECT_RATIO}
        alt={"pommel horse element"}
      />
    </div>
  );
};
