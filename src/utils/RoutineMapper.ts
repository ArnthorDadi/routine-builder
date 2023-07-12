import { Routine } from "@prisma/client";
import { Apparatus, ElementType } from "@src/elements/types";
import { DBRoutine } from "@src/server/api/routers/routine";
import { Elements } from "@src/elements/Elements";

export function Routine2DBRoutine(routine: ElementType[]): DBRoutine {
  return `[${routine.reduce((prev, curr, index) => {
    return `${prev}${!!prev ? ", " : ""}(${curr.group}, ${curr.elementNr})`;
  }, "")}]`;
}

export type ApparatusRoutineType = {
  id: string;
  dScore: string;
  createdAt: Date;
  // routine: ElementType[];
};

export function DVRoutine2DBRoutine(dbRoutines: Routine[]) {
  const floorRoutines: ApparatusRoutineType[] = [];
  const pommelHorseRoutines: ApparatusRoutineType[] = [];
  const ringsRoutines: ApparatusRoutineType[] = [];
  const vaultRoutines: ApparatusRoutineType[] = [];
  const parallelBarsRoutines: ApparatusRoutineType[] = [];
  const highBarRoutines: ApparatusRoutineType[] = [];

  dbRoutines.forEach((dbRoutine) => {
    const { id, dScore, routine, apparatus, createdAt } = dbRoutine;
    const elements = routine.slice(1, routine.length - 2).split("),");

    let apparatusList:
      | ElementType[]
      | Omit<ElementType, "element_alphabetic_value">[] = [];
    let routineListToAddTo = [];
    switch (apparatus) {
      case "floor":
        apparatusList = Elements.floor;
        routineListToAddTo = floorRoutines;
        break;
      case "pommel-horse":
        apparatusList = Elements.pommel_horse;
        routineListToAddTo = pommelHorseRoutines;
        break;
      case "rings":
        apparatusList = Elements.rings;
        routineListToAddTo = ringsRoutines;
        break;
      case "vault":
        apparatusList = Elements.vault;
        routineListToAddTo = vaultRoutines;
        break;
      case "parallel-bars":
        apparatusList = Elements.parallel_bars;
        routineListToAddTo = parallelBarsRoutines;
        break;
      case "high-bar":
        apparatusList = Elements.high_bar;
        routineListToAddTo = highBarRoutines;
        break;
    }

    const elementList:
      | ElementType[]
      | Omit<ElementType, "element_alphabetic_value">[] = [];

    elements.forEach((element) => {
      const split = element.replace("(", "").replaceAll(" ", "").split(",");
      const group = split[0];
      const elementNr = split[1];
      const elementNrNumber = !!elementNr ? parseInt(elementNr) : -1;

      if (!group || !elementNr) {
        return;
      }
      const CoPElement = apparatusList.find(
        (e2) => group === e2.group && elementNrNumber === e2.elementNr
      );
      if (!CoPElement) {
        return;
      }
      elementList.push(CoPElement as ElementType);
    });
    if (elementList.length <= 0) {
      return;
    }
    routineListToAddTo.push({
      id,
      dScore,
      createdAt,
    });
  });

  return {
    floor: floorRoutines,
    "pommel-horse": pommelHorseRoutines,
    rings: ringsRoutines,
    vault: vaultRoutines,
    "parallel-bars": parallelBarsRoutines,
    "high-bar": highBarRoutines,
  };
}
