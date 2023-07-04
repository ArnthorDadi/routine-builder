"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";

type RequirementGroupContextType = {
  I: boolean;
  II: boolean;
  III: boolean;
  IV: boolean;
  setI: Dispatch<SetStateAction<boolean>>;
  setII: Dispatch<SetStateAction<boolean>>;
  setIII: Dispatch<SetStateAction<boolean>>;
  setIV: Dispatch<SetStateAction<boolean>>;
};

export const RequirementGroupContext =
  createContext<RequirementGroupContextType>(
    {} as unknown as RequirementGroupContextType
  );

type RequirementGroupProviderProps = {
  children: React.ReactNode;
};

export const RequirementGroupProvider: React.FC<
  RequirementGroupProviderProps
> = ({ children }) => {
  const [I, setI] = useState(true);
  const [II, setII] = useState(true);
  const [III, setIII] = useState(true);
  const [IV, setIV] = useState(true);

  const value = useMemo(
    () =>
      ({
        I,
        II,
        III,
        IV,
        setI,
        setII,
        setIII,
        setIV,
      } as RequirementGroupContextType),
    [I, II, III, IV, setI, setII, setIII, setIV]
  );

  return (
    <RequirementGroupContext.Provider value={value}>
      {children}
    </RequirementGroupContext.Provider>
  );
};
