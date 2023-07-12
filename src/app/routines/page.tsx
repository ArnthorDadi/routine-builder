"use client";

import {api} from "@src/utils/api";
import {Spinner} from "@components/Spinner";
import {RoutinesAccordion} from "@src/app/routines/utils";

export default function Routines() {
  const routines = api.routine.getRoutines.useQuery();
  return (
    <>
      {routines.data && !routines.isLoading ? (
        <RoutinesAccordion apparatus={routines.data} />
      ) : null}
      {!routines.data && !routines.isLoading ? (
        <div className={"flex flex-1 items-center justify-center"}>
          <p className={"text-sm text-white"}>No routines</p>
        </div>
      ) : null}
      {routines.isLoading ? (
        <div className={"flex flex-1 items-center justify-center"}>
          <Spinner />
        </div>
      ) : null}
    </>
  );
}
