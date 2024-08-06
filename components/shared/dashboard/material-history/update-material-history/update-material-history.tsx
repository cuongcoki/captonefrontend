import React from "react";
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
import UpdateMaterialHistoryForm from "@/components/shared/dashboard/material-history/update-material-history/update-material-history-form";
export default function UpdateMaterialHistory({
  children,
  id,
}: {
  children: any;
  id: string;
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className=" max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Cập nhật lịch sử nhập</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          {/* <UpdateMaterialHistoryForm id={id} /> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
