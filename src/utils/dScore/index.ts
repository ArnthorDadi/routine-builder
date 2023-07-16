import {
  CalculatePommelHorseDifficultyScoreElementType,
  ElementType,
  ProcessedPommelHorseElementType,
} from "@src/elements/types";
import { v4 as uuidv4 } from "uuid";
import { combineFlops } from "@src/utils/dScore/combineFlops";

export function processPommelHorseRoutine(
  routine: ProcessedPommelHorseElementType[]
) {
  let dScore = 0;
  let UIRoutine = [] as ProcessedPommelHorseElementType[];

  routine = _resetUIRoutine(routine);

  // 1. Combine all single pommel Element into flops, if possible
  let dScoreRoutine = combineFlops(routine);
  dScoreRoutine = removeExtraFlops(dScoreRoutine);
  dScoreRoutine = inactivateExtraSpecialRepetitionElements(dScoreRoutine);
  dScoreRoutine = inactivateRepetitionElements(dScoreRoutine);
  dScoreRoutine = inactivateAllButTopElementsInEachGroup(dScoreRoutine);

  dScore = calculateRoutineScore(dScoreRoutine);
  mapDifficultyScoreToUIElements(dScoreRoutine, UIRoutine);

  return {
    routine: UIRoutine,
    dScore,
  };
}

function mapDifficultyScoreToUIElements(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[],
  UIRoutine: ProcessedPommelHorseElementType[]
) {
  dScoreRoutine.forEach((e) => {
    if (e.flop) {
      e.flop.elements.forEach((flopElement, index) => {
        UIRoutine.push({
          ...flopElement,
          id: uuidv4(),
          doesElementCount: e.doesElementCount,
          flop: {
            index,
            length: e.flop?.elements?.length,
            numericValue: e.element_numeric_value,
            alphabeticValue: e.element_alphabetic_value,
          },
        } as ProcessedPommelHorseElementType);
      });
    } else {
      UIRoutine.push(e as ProcessedPommelHorseElementType);
    }
  });
}

function calculateRoutineScore(
  inputRoutine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  const routine = [] as CalculatePommelHorseDifficultyScoreElementType[];
  inputRoutine.forEach((e) => routine.push(e));

  const groups = {};
  let groupValue = 0;
  routine.forEach((element) => {
    if (!element.doesElementCount) {
      return;
    }
    // @ts-ignore
    if (!groups[element.group]) {
      if (element.group === "IV") {
        switch (element.element_alphabetic_value) {
          case "A":
          case "B":
            groupValue += 0;
            break;
          case "C":
            groupValue += 0.3;
            break;
          default:
            groupValue += 0.5;
            break;
        }
      } else {
        groupValue += 0.5;
      }
      // @ts-ignore
      groups[element.group] = element;
    }
  });

  const elementValue: number = routine
    .sort(_sortElementsByDifficulty)
    .slice(0, 10)
    .reduce((score, element) => score + element.element_numeric_value, 0);

  return groupValue + elementValue;
}

function inactivateExtraSpecialRepetitionElements(
  routine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  // 3. Special repetitions:

  // a) A maximum of two (3/3) cross support travels (forwards and/
  // or backwards) are permitted during the exercise. This rule
  // applies to the following eight travels ONLY:
  // Group: "III", elements nr: [39, 40, 41, 42, 45, 51, 52, 53]
  routine = applySpecialRepetition(
    routine,
    "III",
    [39, 40, 41, 42, 45, 51, 52, 53]
  );
  // b) A maximum of two Russian Wendeswings are permitted for
  // value in an exercise, including the dismount. For Pommel
  // Horse these special repetition rules are wider, any 2nd Russian
  // Wenderswing element on the end including dismount or 2nd
  // Russian Wenderswing element between pommels considered
  // as repetition
  // Group: "III", elements nr: [97, 98, 99, 100, 103, 104, 105, 106, 110, 111, 112, 113], +47
  routine = applySpecialRepetition(
    routine,
    "II",
    [97, 98, 99, 100, 103, 104, 105, 106, 110, 111, 112, 113]
  );

  // c) A maximum of 2 handstand elements are permitted for value
  // in an exercise from circles, flairs, or scissors (not including the
  // dismount)
  routine = applySpecialRepetitionRule_3C(routine);

  // d) A maximum of two (3/3) Russian Wendeswings travel elements
  // are permitted for value in an exercise. This rule applies to the
  // following travels ONLY:
  // Group: "III", elements nr: [70, 75, 76, 77, 81, 82, 89], +167
  routine = applySpecialRepetition(
    routine,
    "III",
    [70, 75, 76, 77, 81, 82, 89]
  );

  // e) A maximum of two 3/3 travel with Spindle elements are permitted for value in an exercise. This rule applies to the following
  // travels ONLY:
  // Group: "III", elements nr: [23, 28, 29, 35], +167
  routine = applySpecialRepetition(routine, "III", [23, 28, 29, 35]);

  // f) A maximum of two full Spindle elements are permitted for value
  // in an exercise. This rule applies to the following spindle ONLY:
  // Group: "II", elements nr: [28, 29, 30, 24, 25, 41], +47
  routine = applySpecialRepetition(routine, "II", [28, 29, 30, 34, 35, 41]);

  // g)	A maximum of two Bezugo type elements, including combined
  // and Handstands.
  routine = applySpecialRepetitionRule_3G(routine);

  // h)	A maximum of two Sohn type elements, including combined
  // and Handstands.
  return routine;
}

export function applySpecialRepetitionRule_3G(
  routine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  // g)	A maximum of two Bezugo type elements, including combined
  // and Handstands.

  // Get handstand elements
  const bezugoElements = routine
    .map((element, index) => ({ index, ...element }))
    .filter((element) => {
      return (
        isOneOf(element.name, ["Bezugo"]) ||
        isOneOf(element.explanation, ["Bezugo"])
      );
    });

  const elementsToRemove =
    getSpecialRepetitionElementsToMakeInactive(bezugoElements);

  routine = makeElementsInactiveFromRoutine(routine, elementsToRemove);

  return routine;
}

function makeElementsInactiveFromRoutine(
  routine: CalculatePommelHorseDifficultyScoreElementType[],
  elementsToMakeInactive: CalculatePommelHorseDifficultyScoreElementType[]
) {
  return routine.map((element) => {
    const doesElementCount = !elementsToMakeInactive.some(
      (elementToRemove) =>
        element.page_nr === elementToRemove.page_nr &&
        element.row === elementToRemove.row &&
        element.col === elementToRemove.col
    );
    return {
      ...element,
      doesElementCount: doesElementCount ? element.doesElementCount : false,
    };
  });
}

function getSpecialRepetitionElementsToMakeInactive(
  elements: CalculatePommelHorseDifficultyScoreElementType[],
  nrOfElements = 2
) {
  const elementsOrderedAfterDifficulty = elements.sort(
    _sortElementsByDifficulty
  );

  return elementsOrderedAfterDifficulty.slice(nrOfElements);
}

export function applySpecialRepetitionRule_3C(
  routine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  // c) A maximum of 2 handstand elements are permitted for value
  // in an exercise from circles, flairs, or scissors (not including the
  // dismount)

  // Get handstand elements
  let handstandElements = routine.filter((element) => {
    return isOneOf(element.explanation, ["Handstand", "hstd", "hdst"]);
  });

  // Remove handstand dismount
  handstandElements = handstandElements.filter(
    (handstandElement) => handstandElement.group !== "IV"
  );

  const elementsToRemove =
    getSpecialRepetitionElementsToMakeInactive(handstandElements);

  routine = makeElementsInactiveFromRoutine(routine, elementsToRemove);

  return routine;
}

function isOneOf(text: string, includes: string[]) {
  return includes.some((include) =>
    text.toLowerCase().includes(include.toLowerCase())
  );
}

export function applySpecialRepetition(
  routine: CalculatePommelHorseDifficultyScoreElementType[],
  group: ProcessedPommelHorseElementType["group"],
  nr: ProcessedPommelHorseElementType["elementNr"][]
) {
  const specialRepetitionElements = createElementGroupAndNrsList(group, nr);

  const foundSpecialRepetitionElements = routine.filter((element) => {
    return specialRepetitionElements.some((specialRepetitionElement) => {
      return (
        specialRepetitionElement.group === element.group &&
        specialRepetitionElement.nr === element.elementNr
      );
    });
  });

  const elementsToMakeInactive = getSpecialRepetitionElementsToMakeInactive(
    foundSpecialRepetitionElements
  );

  routine = makeElementsInactiveFromRoutine(routine, elementsToMakeInactive);

  return routine;
}

function createElementGroupAndNrsList(
  group: ProcessedPommelHorseElementType["group"],
  nrs: number[]
) {
  return nrs.map((nr) => ({ group, nr }));
}

function removeExtraFlops(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  let flops = [] as (CalculatePommelHorseDifficultyScoreElementType & {
    index: number;
  })[];
  dScoreRoutine.map((e, index) => {
    if (e.flop) {
      flops.push({
        ...e,
        index,
      });
    }
  });
  flops = flops.sort(_sortElementsByDifficulty);
  const topTwoFlops = flops.slice(0, 2);
  return dScoreRoutine.map((e, index) => {
    let doesElementCount = !e.flop;
    if (e.flop && topTwoFlops.some((flop) => flop.index === index)) {
      doesElementCount = true;
    }
    return { ...e, doesElementCount };
  });
}

function _resetUIRoutine(routine: ProcessedPommelHorseElementType[]) {
  return routine.map((e) => {
    const { flop, ...rest } = e;
    return rest as ProcessedPommelHorseElementType;
  });
}

export function _isSameElement(e1: ElementType, e2: ElementType) {
  return e1.page_nr === e2.page_nr && e1.row === e2.row && e1.col === e2.col;
}

export function _sortElementsByDifficulty(a: ElementType, b: ElementType) {
  if (a.element_numeric_value > b.element_numeric_value) {
    return -1;
  } else if (a.element_numeric_value < b.element_numeric_value) {
    return 1;
  } else {
    return 0;
  }
}

function inactivateRepetitionElements(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  const elementsInRoutine =
    [] as CalculatePommelHorseDifficultyScoreElementType[];
  return dScoreRoutine.map((e) => {
    if (
      e.doesElementCount &&
      elementsInRoutine.some((e2) => _isSameElement(e, e2))
    ) {
      // Element counts and has already been performed
      // Make it not count anymore since it has already been performed
      return {
        ...e,
        doesElementCount: false,
      };
    }
    elementsInRoutine.push(e);
    return e;
  });
}

function inactivateAllButTopElementsInEachGroup(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  const { I, II, III, IV } =
    _getTopFiveActiveElementsInEachGroup(dScoreRoutine);
  return dScoreRoutine.map((e) => {
    if (!e.doesElementCount) {
      return e;
    }
    const isInRequirementGroupI = I.some((e2) => _isSameElement(e, e2));
    const isInRequirementGroupII = II.some((e2) => _isSameElement(e, e2));
    const isInRequirementGroupIII = III.some((e2) => _isSameElement(e, e2));
    const isInRequirementGroupIV = IV.some((e2) => _isSameElement(e, e2));
    const isInAnyRequirementGroup =
      isInRequirementGroupI ||
      isInRequirementGroupII ||
      isInRequirementGroupIII ||
      isInRequirementGroupIV;

    return {
      ...e,
      doesElementCount: isInAnyRequirementGroup,
    };
  });
}

function _getTopFiveActiveElementsInEachGroup(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[]
) {
  let [{ I, II, III, IV }, _] = _groupElementsByGroup(dScoreRoutine);
  I = I.filter((e) => e.doesElementCount).slice(0, 5);
  II = II.filter((e) => e.doesElementCount).slice(0, 5);
  III = III.filter((e) => e.doesElementCount).slice(0, 5);
  IV = IV.filter((e) => e.doesElementCount).slice(0, 5);
  return {
    I,
    II,
    III,
    IV,
  };
}

export function _groupElementsByGroup(
  routine: CalculatePommelHorseDifficultyScoreElementType[],
  sort = true
): [
  {
    I: CalculatePommelHorseDifficultyScoreElementType[];
    II: CalculatePommelHorseDifficultyScoreElementType[];
    III: CalculatePommelHorseDifficultyScoreElementType[];
    IV: CalculatePommelHorseDifficultyScoreElementType[];
  },
  number
] {
  let nrGroupsThatHaveElements = 0;
  let I = [] as CalculatePommelHorseDifficultyScoreElementType[];
  let II = [] as CalculatePommelHorseDifficultyScoreElementType[];
  let III = [] as CalculatePommelHorseDifficultyScoreElementType[];
  let IV = [] as CalculatePommelHorseDifficultyScoreElementType[];
  routine.forEach((element, index) => {
    const addedElement = { ...element, index };
    switch (element.group) {
      case "I":
        if (I.length === 0) {
          nrGroupsThatHaveElements += 1;
        }
        I.push(addedElement);
        break;
      case "II":
        if (II.length === 0) {
          nrGroupsThatHaveElements += 1;
        }
        II.push(addedElement);
        break;
      case "III":
        if (III.length === 0) {
          nrGroupsThatHaveElements += 1;
        }
        III.push(addedElement);
        break;
      case "IV":
        if (IV.length === 0) {
          nrGroupsThatHaveElements += 1;
        }
        IV.push(addedElement);
        break;
    }
  });

  if (sort) {
    I.sort(_sortElementsByDifficulty);
    II.sort(_sortElementsByDifficulty);
    III.sort(_sortElementsByDifficulty);
    IV.sort(_sortElementsByDifficulty);
  }
  const groups = { I, II, III, IV };
  return [groups, nrGroupsThatHaveElements];
}
