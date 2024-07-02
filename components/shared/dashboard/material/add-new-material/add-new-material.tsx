import React from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddNewMeterialForm from "@/components/shared/dashboard/material/add-new-material/add-new-material-form";
export default function AddNewMeterial() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-primary flex items-center m-2 ml-auto">
            <Plus /> Thêm mới
          </Button>
        </DialogTrigger>
        <DialogContent className=" max-w-[340px] md:max-w-[700px] dark:bg-[#1c1917]">
          <DialogDescription></DialogDescription>
          <DialogTitle></DialogTitle>
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#22c55e] w-full text-center mb-3">
              Thêm mới nguyên liệu
            </DialogTitle>
          </DialogHeader>
          <AddNewMeterialForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
