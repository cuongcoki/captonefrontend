import { BreadcrumbComponent } from "@/components/shared/BreadcrumbComponent";
import { CardTitle } from "@/components/ui/card";
import React from "react";

export default function HeaderComponent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <BreadcrumbComponent />
      <CardTitle>
        <div className="text-2xl font-semibol text-[#22c55e] text-left w-full tracking-tight">
          {title}
        </div>
        <span className="text-xs font-normal leading-snug text-muted-foreground">
          {description}
        </span>
      </CardTitle>
      <div
        data-orientation="horizontal"
        role="none"
        className="shrink-0 bg-border h-[1px] w-full my-4"
      ></div>
    </>
  );
}
