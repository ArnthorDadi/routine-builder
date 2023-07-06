import { StaticImageData } from "next/image";

export enum Apparatus {
  floor = "floor",
  pommel_horse = "pommel-horse",
  vault = "vault",
  rings = "rings",
  parallel_bars = "parallel-bars",
  high_bar = "high-bar",
}

export const ApparatusList = [
  Apparatus.floor,
  Apparatus.pommel_horse,
  Apparatus.rings,
  Apparatus.vault,
  Apparatus.parallel_bars,
  Apparatus.high_bar,
];

export type ElementType = {
  name: string;
  explanation: string;
  group: "I" | "II" | "III" | "IV";
  group_name: string;
  element_alphabetic_value: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
  element_numeric_value:
    | 0
    | 0.1
    | 0.2
    | 0.3
    | 0.4
    | 0.5
    | 0.6
    | 0.7
    | 0.8
    | 0.9;
  page_nr: number;
  row: number;
  col: number;
  /* This is an image */
  img: string;
  elementNr: number;
};

export type ElementTypeWithId = ElementType & {
  id: string;
};

export type ProcessedPommelHorseElementType = ElementTypeWithId & {
  doesElementCount: boolean;
  flop?: {
    index: number;
    length: number;
    numericValue: ElementType["element_numeric_value"];
    alphabeticValue: ElementType["element_alphabetic_value"];
  };
};
