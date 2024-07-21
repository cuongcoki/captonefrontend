import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { productPhaseStore } from "@/components/shared/dashboard/product-phase/product-phase-store";

export default function ProductPhaseChangePhase({ index }: { index: number }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { tableData, ForceRender } = productPhaseStore();
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="hover:bg-gray-200 hover:cursor-pointer relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            Thay đổi trạng thái
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">
              Thay đôi trang thái
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
