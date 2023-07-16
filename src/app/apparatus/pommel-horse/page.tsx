"use client";

import { CoPList } from "@components/CoPList";
import { Elements } from "@src/elements/Elements";
import { PommelHorseRoutineList } from "@components/routine-list/PommelHorseRoutineList";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ElementTypeWithId,
  ProcessedPommelHorseElementType,
} from "@src/elements/types";

const myRoutine: number[] = [0, 48, 139, 48, 217, 60, 207, 160, 244, 249, 273];

export default function PommelHorse() {
  const [routine, setRoutine] = useState<ProcessedPommelHorseElementType[]>(
    myRoutine.map(
      (index) =>
        ({
          ...Elements.pommel_horse[index],
          id: uuidv4(),
        } as ProcessedPommelHorseElementType)
    )
  );

  return (
    <>
      <CoPList elementList={Elements.pommel_horse} />
      <PommelHorseRoutineList
        routine={routine}
        className={"fixed bottom-0 left-0 right-0 bg-green-500"}
      />
    </>
  );
}
