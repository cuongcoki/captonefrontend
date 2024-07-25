import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import ProductPhaseChangeQuantityType from "@/components/shared/dashboard/product-phase/product-phase-change-quantity-type";
import { productPhaseStore } from "@/components/shared/dashboard/product-phase/product-phase-store";
import ProductPhaseChangePhase from "@/components/shared/dashboard/product-phase/product-phase-change-phase";

export default function ProductPhaseAction({ index }: { index: number }) {
  const [open, setOpen] = React.useState(false);
  const { tableData } = productPhaseStore();
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <ProductPhaseChangeQuantityType index={index} />
          {tableData[index].phaseName == "PH_002" && (
            <ProductPhaseChangePhase index={index} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
