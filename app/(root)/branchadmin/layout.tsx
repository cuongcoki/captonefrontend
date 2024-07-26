"use client";
// ** React Imports
import { CheckPermissionEnter } from "@/lib/utils";
import { useEffect, useState } from "react";
export default function Layout({children}: {children: React.ReactNode}) {
    useEffect(() => {
        CheckPermissionEnter(2);
      }, []);
    return (
        <section>
            {children}
        </section>
    );
}