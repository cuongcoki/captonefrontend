"use client";
// ** React Imports
import { CheckPermissionEnter } from "@/lib/utils";
import { useEffect, useState } from "react";
export default function Page() {
  useEffect(() => {
    CheckPermissionEnter(1);
  }, []);
  return <div></div>;
}
