"use client";

import React, { useContext } from "react";
import { cn } from "@src/utils/Utility";
import {
  RequirementGroupContext,
  RequirementGroupProvider,
} from "@src/app/apparatus/providers";
import { Breadcrumbs } from "@components/layout/Breadcrumbs";

export default function RoutinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={""}>{children}</div>;
}
