import React, { FC, useState } from "react";
import { ApparatusRoutineType } from "@src/utils/RoutineMapper";
import { cn } from "@src/utils/Utility";

type RoutineTileProps = {
  routine: ApparatusRoutineType;
};

export const RoutineTile: React.FC<RoutineTileProps> = ({ routine }) => {
  return (
    <div
      className={
        "flex flex-row items-center justify-center gap-4 rounded-lg border border-accent px-4 py-2 text-accent transition-all hover:cursor-pointer hover:bg-accent hover:text-background"
      }
    >
      <p className={"select-none text-sm font-semibold"}>D: {routine.dScore}</p>
      <p className={"select-none text-xs italic"}>
        {routine?.createdAt?.toDateString()}
      </p>
    </div>
  );
};

type RoutinesAccordionProps = {
  apparatus: {
    floor: ApparatusRoutineType[];
    "pommel-horse": ApparatusRoutineType[];
    rings: ApparatusRoutineType[];
    vault: ApparatusRoutineType[];
    "parallel-bars": ApparatusRoutineType[];
    "high-bar": ApparatusRoutineType[];
  };
  className?: string;
};
export const RoutinesAccordion: FC<RoutinesAccordionProps> = ({
  className,
  apparatus,
}) => {
  return (
    <div
      id="accordion-flush"
      data-accordion="collapse"
      data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      data-inactive-classes="text-gray-500 dark:text-gray-400"
    >
      {Object.keys(apparatus).map((routineKey) => (
        <RoutinesAccordionItem
          key={routineKey}
          title={
            routineKey.slice(0, 1).toUpperCase() +
            routineKey.replaceAll("-", " ").slice(1)
          }
          routines={apparatus?.[routineKey as keyof typeof apparatus]}
        />
      ))}
    </div>
  );
};
type RoutinesAccordionItemProps = {
  title: string;
  routines: ApparatusRoutineType[];
};
const RoutinesAccordionItem: FC<RoutinesAccordionItemProps> = ({
  title,
  routines,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <h2 id="accordion-flush-heading-1">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          className="flex w-full items-center gap-8 border-b border-gray-700 py-5 text-left font-medium text-gray-400 text-neutral"
          data-accordion-target="#accordion-flush-body-1"
          aria-expanded="true"
          aria-controls="accordion-flush-body-1"
        >
          <div className={"ml-2"}>
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
          </div>
          <span className={"text-accent"}>{title}</span>
        </button>
      </h2>
      <div
        id="accordion-flush-body-1"
        className={cn(!isOpen && "hidden")}
        aria-labelledby="accordion-flush-heading-1"
      >
        <div className="flex flex-row flex-wrap gap-2 py-5">
          {routines && routines.length > 0
            ? routines.map((routine) => (
                <RoutineTile key={routine.id} routine={routine} />
              ))
            : null}
          {!routines || routines.length <= 0 ? (
            <p className={"text-gray-500"}>No routines</p>
          ) : null}
        </div>
      </div>
    </>
  );
};
