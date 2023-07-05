import {
  ElementTypeWithId,
  ProcessedPommelHorseElementType,
} from "@src/elements/types";

export function useProcessPommelHorseRoutine(routine: ElementTypeWithId[]) {
  const UIRoutine = routine.map(
    (element) => element as ProcessedPommelHorseElementType
  );
  const dScore = "4.9";
  return { UIRoutine, dScore };
}
