import React, { use, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNewMeterialForm from "@/components/shared/dashboard/material/add-new-material/add-new-material-form";
import UpdateMaterialForm from "@/components/shared/dashboard/material/update-material/update-material-form";
export default function UpdateMaterial({
  children,
  id,
}: {
  children: any;
  id: string;
}) {
  return (
    <>
      <Dialog modal={true}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className=" max-w-[340px] md:max-w-[700px] dark:bg-[#1c1917]">
          <DialogHeader>
            <DialogTitle>Cập nhật nguyên liệu</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <UpdateMaterialForm id={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
