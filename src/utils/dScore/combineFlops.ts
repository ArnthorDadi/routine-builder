import {
  CalculatePommelHorseDifficultyScoreElementType,
  ElementType,
  ProcessedPommelHorseElementType,
} from "@src/elements/types";
import { _isSameElement } from "@src/utils/dScore/index";

type PossibleFlopCombinationType = ProcessedPommelHorseElementType;

export function combineFlops(routine: ProcessedPommelHorseElementType[]) {
  const UIRoutine: ProcessedPommelHorseElementType[] = [];
  const dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[] = [];

  // const possibleFlopCombinations = [] as (ProcessedPommelHorseElementType & { index: number })[][];
  let possibleFlopCombination = [] as PossibleFlopCombinationType[];

  let prevElement: ProcessedPommelHorseElementType | undefined = undefined;
  let prevPrevElement: ProcessedPommelHorseElementType | undefined = undefined;

  let wasLastElementSinglePommelElement = false;
  let hasElementBeenRepeatedThreeTimesInSuccession = false;
  let hasFlopReachedMaximumValue = false;

  routine.forEach((element, index) => {
    const isCurrentElementSinglePommelElement =
      _isElementSinglePommelElement(element);
    const isLastElement = routine.length - 1 == index;

    if (isCurrentElementSinglePommelElement) {
      const flopElement = _getOnePommelElement(element);

      // Flop is over when
      // 1. One of the flop element has been repeated three times in a direct succession
      const hasRepeatedThreeTimes = _getHasElementBeenRepeatedThreeTimesInARow(
        element,
        prevElement,
        prevPrevElement
      );

      if (
        !hasElementBeenRepeatedThreeTimesInSuccession &&
        hasRepeatedThreeTimes
      ) {
        hasElementBeenRepeatedThreeTimesInSuccession = true;
      }

      // 2. The current flop has already reached its maximum value
      //    the highest value flop is an E, anything more is still an E value
      const hasReachedMaxValue =
        possibleFlopCombination.length > 0 &&
        getHasFlopReachedMaximumValue(possibleFlopCombination);

      if (!hasFlopReachedMaximumValue && hasReachedMaxValue) {
        hasFlopReachedMaximumValue = true;
      }

      /* Start evaluating the possible flop */
      if (
        flopElement === _OnePommelElement.Davtyan ||
        flopElement === _OnePommelElement.Bertoncelj
      ) {
        // Evaluate flop and start next one
        _isFlopCombinationValid(possibleFlopCombination)
          ? handleAddFlop(dScoreRoutine, possibleFlopCombination)
          : _handleAddFlopElementsToRoutine(
              dScoreRoutine,
              possibleFlopCombination
            );

        possibleFlopCombination = [element];
      } else if (flopElement === _OnePommelElement.DSA) {
        possibleFlopCombination.push(element);
        // Evaluate flop
        _isFlopCombinationValid(possibleFlopCombination)
          ? handleAddFlop(dScoreRoutine, possibleFlopCombination)
          : _handleAddFlopElementsToRoutine(
              dScoreRoutine,
              possibleFlopCombination
            );

        possibleFlopCombination = [];
      } else if (hasRepeatedThreeTimes) {
        // Initial time that a flop element has been repeated three times in a direct succession
        // Evaluate previous flop
        _isFlopCombinationValid(possibleFlopCombination)
          ? handleAddFlop(dScoreRoutine, possibleFlopCombination)
          : _handleAddFlopElementsToRoutine(
              dScoreRoutine,
              possibleFlopCombination
            );

        possibleFlopCombination = [];
      } else if (
        hasElementBeenRepeatedThreeTimesInSuccession ||
        hasFlopReachedMaximumValue
      ) {
        // Element has been repeated three times in a direct succession
        // or flop combination has reached its maximum value
        _handleAddFlopElementsToRoutine(dScoreRoutine, [element]);
      } else if (hasReachedMaxValue) {
        // Initial time that a flop combination has reached its maximum value

        _isFlopCombinationValid(possibleFlopCombination)
          ? handleAddFlop(dScoreRoutine, possibleFlopCombination)
          : _handleAddFlopElementsToRoutine(
              dScoreRoutine,
              possibleFlopCombination
            );

        possibleFlopCombination = [];
        _handleAddFlopElementsToRoutine(dScoreRoutine, [element]);
      } else if (isLastElement) {
        // Element is the last one in the routine
        possibleFlopCombination.push(element);

        _isFlopCombinationValid(possibleFlopCombination)
          ? handleAddFlop(dScoreRoutine, possibleFlopCombination)
          : _handleAddFlopElementsToRoutine(
              dScoreRoutine,
              possibleFlopCombination
            );

        possibleFlopCombination = [];
      } else {
        // Should add element to flop
        possibleFlopCombination.push(element);
      }
    } else {
      if (hasFlopReachedMaximumValue) {
        hasFlopReachedMaximumValue = false;
      }

      if (hasElementBeenRepeatedThreeTimesInSuccession) {
        hasElementBeenRepeatedThreeTimesInSuccession = false;
      }

      if (possibleFlopCombination.length > 0) {
        _isFlopCombinationValid(possibleFlopCombination)
          ? handleAddFlop(dScoreRoutine, possibleFlopCombination)
          : _handleAddFlopElementsToRoutine(
              dScoreRoutine,
              possibleFlopCombination
            );
        possibleFlopCombination = [];
      }

      _handleAddFlopElementsToRoutine(dScoreRoutine, [element]);
    }
    prevPrevElement = prevElement;
    prevElement = element;
    wasLastElementSinglePommelElement = isCurrentElementSinglePommelElement;
  });

  return dScoreRoutine;
}

function _isElementSinglePommelElement(element: ElementType) {
  const singlePommelElements = [
    { group: "II", element_nr: 2 },
    { group: "II", element_nr: 14 },
    { group: "II", element_nr: 50 },
    { group: "II", element_nr: 56 },
    { group: "II", element_nr: 69 },
    { group: "II", element_nr: 81 },
    { group: "II", element_nr: 110 },
    { group: "II", element_nr: 111 },
    { group: "II", element_nr: 112 },
    { group: "II", element_nr: 113 },
  ];

  return singlePommelElements.some(
    (e) => e.group == element.group && e.element_nr === element.elementNr
  );
}

enum _OnePommelElement {
  Circle = "Circle",
  DSB = "DSB",
  DSA = "DSA",
  Russian = "Russian",
  Davtyan = "Davtyan",
  Bertoncelj = "Bertoncelj",
}

function _getOnePommelElement(
  element: ProcessedPommelHorseElementType
): _OnePommelElement {
  switch (element.elementNr) {
    case 2:
    case 14:
      return _OnePommelElement.Circle;
    case 50:
      return _OnePommelElement.DSA;
    case 56:
      return _OnePommelElement.DSB;
    case 69:
      return _OnePommelElement.Bertoncelj;
    case 81:
      return _OnePommelElement.Davtyan;
    case 110:
    case 111:
    case 112:
    case 113:
      return _OnePommelElement.Russian;
    default:
      return _OnePommelElement.Circle;
  }
}

function _getHasElementBeenRepeatedThreeTimesInARow(
  element: ProcessedPommelHorseElementType,
  prevElement: ProcessedPommelHorseElementType | undefined,
  prevPrevElement: ProcessedPommelHorseElementType | undefined
) {
  return (
    prevElement &&
    prevPrevElement &&
    _isSameElement(element, prevElement) &&
    _isSameElement(prevElement, prevPrevElement)
  );
}

function getHasFlopReachedMaximumValue(
  flopCombination: ProcessedPommelHorseElementType[]
) {
  const firstElementInArray = flopCombination[0];
  if (!firstElementInArray) {
    return false;
  }
  const firstElement = _getOnePommelElement(firstElementInArray);
  const isFirstElementDavtyanOrBertoncelj =
    firstElement === _OnePommelElement.Davtyan ||
    firstElement === _OnePommelElement.Bertoncelj;
  const isARussianFlop = flopCombination.some(
    (element) => _getOnePommelElement(element) === _OnePommelElement.Russian
  );

  const currentFlopValue = _valuateFlopCombinations(flopCombination);

  if (isFirstElementDavtyanOrBertoncelj) {
    return isARussianFlop ? currentFlopValue === 0.8 : currentFlopValue === 0.6;
  }
  return currentFlopValue === 0.5;
}

function _valuateFlopCombinations(
  prevFlopCombination: ProcessedPommelHorseElementType[]
): ElementType["element_numeric_value"] {
  const cleanedPrevFlopCombination = prevFlopCombination;

  const flopCounter = {
    startsWithDavtyanOrBertoncelj: false,
    circle_DSB_DSA_counter: 0,
    circle_counter: 0,
    baseRussian: 0,
  } as {
    startsWithDavtyanOrBertoncelj: boolean;
    circle_DSB_DSA_counter: number;
    circle_counter: number;
    baseRussian: ProcessedPommelHorseElementType["element_numeric_value"];
  };
  cleanedPrevFlopCombination?.forEach((element) => {
    const elementType = _getOnePommelElement(element);
    switch (elementType) {
      case _OnePommelElement.Bertoncelj:
      case _OnePommelElement.Davtyan:
        flopCounter.startsWithDavtyanOrBertoncelj = true;
        break;
      case _OnePommelElement.Circle:
        flopCounter.circle_DSB_DSA_counter += 1;
        flopCounter.circle_counter += 1;
        break;
      case _OnePommelElement.DSB:
      case _OnePommelElement.DSA:
        flopCounter.circle_DSB_DSA_counter += 1;
        break;
      case _OnePommelElement.Russian:
        flopCounter.baseRussian = element.element_numeric_value;
        break;
    }
  });
  let flopValue = 0;
  if (flopCounter.baseRussian) {
    if (
      flopCounter.startsWithDavtyanOrBertoncelj &&
      _getOnePommelElement(
        cleanedPrevFlopCombination[1] as ProcessedPommelHorseElementType
      ) === _OnePommelElement.Circle
    ) {
      flopValue += 0.3 + flopCounter.baseRussian;
    } else if (
      flopCounter.circle_DSB_DSA_counter === 1 &&
      flopCounter.baseRussian > 0.2
    ) {
      flopValue += 0.1 + flopCounter.baseRussian;
    } else if (flopCounter.circle_DSB_DSA_counter >= 2) {
      flopValue += 0.2 + flopCounter.baseRussian;
    }
  } else {
    if (
      flopCounter.startsWithDavtyanOrBertoncelj &&
      flopCounter.circle_DSB_DSA_counter > 1
    ) {
      flopValue += flopCounter.circle_DSB_DSA_counter > 2 ? 0.6 : 0.5;
    } else if (flopCounter.circle_DSB_DSA_counter > 2) {
      flopValue += flopCounter.circle_DSB_DSA_counter > 3 ? 0.5 : 0.4;
    }
  }

  return flopValue as ProcessedPommelHorseElementType["element_numeric_value"];
}

function _isFlopCombinationValid(
  possibleFlopCombination: PossibleFlopCombinationType[]
) {
  const flopValue = _valuateFlopCombinations(possibleFlopCombination);
  return flopValue > 0;
}

function _handleAddFlopElementsToRoutine(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[],
  possibleFlopCombination: PossibleFlopCombinationType[]
) {
  possibleFlopCombination.forEach((e) =>
    dScoreRoutine.push(e as CalculatePommelHorseDifficultyScoreElementType)
  );
}

function handleAddFlop(
  dScoreRoutine: CalculatePommelHorseDifficultyScoreElementType[],
  flopCombination: PossibleFlopCombinationType[]
) {
  const flopValue = _valuateFlopCombinations(flopCombination);
  const isRussianFlop = flopCombination.some(
    (e) => _getOnePommelElement(e) === _OnePommelElement.Russian
  );
  const hasSohnElement = flopCombination.some(
    (e) => _getOnePommelElement(e) === _OnePommelElement.Bertoncelj
  );
  const hasBezugoElement = flopCombination.some(
    (e) => _getOnePommelElement(e) === _OnePommelElement.Davtyan
  );
  let name = "";
  if (hasSohnElement) {
    name += "Sohn ";
  } else if (hasBezugoElement) {
    name += "Bezugo ";
  }
  name += isRussianFlop ? "Russian Flop" : "Flop";

  dScoreRoutine.push({
    name: name,
    explanation: "",
    group: "II",
    group_name: "",
    element_alphabetic_value: _getAlphabeticValueFromNumericValue(flopValue),
    element_numeric_value: flopValue,
    page_nr: isRussianFlop ? 999 : 998,
    row: isRussianFlop ? 999 : 998,
    col: isRussianFlop ? 999 : 998,
    elementNr: isRussianFlop ? 999 : 998,
    flop: {
      elements: flopCombination as ElementType[],
    },
  } as CalculatePommelHorseDifficultyScoreElementType);
}

function _getAlphabeticValueFromNumericValue(
  value: ElementType["element_numeric_value"]
): ElementType["element_alphabetic_value"] {
  switch (value) {
    case 0:
    case 0.1:
      return "A";
    case 0.2:
      return "B";
    case 0.3:
      return "C";
    case 0.4:
      return "D";
    case 0.5:
      return "E";
    case 0.6:
      return "F";
    case 0.7:
      return "G";
    case 0.8:
      return "H";
    case 0.9:
      return "I";
  }
}
