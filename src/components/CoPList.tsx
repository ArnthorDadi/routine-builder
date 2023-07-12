import React, { useContext } from "react";
import { ElementType } from "@src/elements/types";
import Image from "next/image";
import { RequirementGroupContext } from "@src/app/apparatus/providers";
import { IMG_ASPECT_RATIO } from "@components/routine-list/PommelHorseRoutineList";

type CoPListProps = {
  elementList: (ElementType | Omit<ElementType, "element_alphabetic_value">)[];
};

export const CoPList: React.FC<CoPListProps> = ({ elementList }) => {
  const { I, II, III, IV } = useContext(RequirementGroupContext);
  return (
    <div className={"flex flex-row flex-wrap"}>
      {elementList.map((element, index) => {
        const shouldFilterOutRequirementGroup =
          (element.group === "I" && !I) ||
          (element.group === "II" && !II) ||
          (element.group === "III" && !III) ||
          (element.group === "IV" && !IV);

        if (shouldFilterOutRequirementGroup) {
          return null;
        }

        const isNewPage = index % (6 * 4) === 0;

        return (
          <React.Fragment
            key={`${element?.page_nr}-${element?.row}-${element?.col}`}
          >
            {isNewPage ? (
              <CoPGroupBanner
                group={element.group}
                group_name={element.group_name}
              />
            ) : null}
            <CoPElement
              key={`${element?.page_nr}-${element?.row}-${element?.col}`}
              element={element}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

type CoPGroupBannerProps = {
  group: ElementType["group"];
  group_name: ElementType["group_name"];
};
export const CoPGroupBanner: React.FC<CoPGroupBannerProps> = ({
  group,
  group_name,
}) => {
  return (
    <div className={"w-[99.6%] pt-4"}>
      <p className={"select-none pb-4 text-center text-xl text-white"}>
        Group {group}: {group_name}
      </p>
      <div className={"grid w-full grid-cols-6"}>
        {["A", "B", "C", "D", "E", "F/G/H/I"].map((value) => (
          <p
            key={value}
            className={
              "select-none border-2 border-white py-2 text-center text-white"
            }
          >
            {value}
          </p>
        ))}
      </div>
    </div>
  );
};

type CoPElementProps = {
  element: ElementType | Omit<ElementType, "element_alphabetic_value">;
};

const IMG_WIDTH = 400;

export const CoPElement: React.FC<CoPElementProps> = ({ element }) => {
  return (
    <div className={"flex w-[16.6%] flex-col"}>
      <Image
        className={
          "border-2 border-white bg-white p-2 transition-all hover:scale-110 hover:cursor-pointer hover:rounded-xl hover:border-black"
        }
        key={`${element?.page_nr}-${element?.row}-${element?.col}`}
        src={element?.img}
        width={IMG_WIDTH}
        height={IMG_WIDTH * IMG_ASPECT_RATIO}
        alt={"pommel horse element"}
      />
      {/*<p*/}
      {/*  className={"text-center text-white"}*/}
      {/*>{`Element number: ${element.elementNr}`}</p>*/}
      {/*<p className={'text-center text-white'}>{`Index: ${index}`}</p>*/}
      {/*<p className={'text-center text-white'}>*/}
      {/*    {`page_nr: ${element?.page_nr}- row: ${element?.row}- col:${element?.col}`}*/}
      {/*</p>*/}
      {/*<p className={'text-center text-white'}>group: {element.group}</p>*/}
      {/*<p className={'text-center text-white'}>name: {element.name}</p>*/}
      {/*<p className={'text-center text-white'}>*/}
      {/*    explanation: {element.explanation}*/}
      {/*</p>*/}
      {/*<p className={'text-center text-white'}>*/}
      {/*    value: {element.element_alphabetic_value} |{' '}*/}
      {/*    {element.element_numeric_value}{' '}*/}
      {/*</p>*/}
    </div>
  );
};
