import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        </DialogContent>
      </Dialog>
    </>
  );
}
