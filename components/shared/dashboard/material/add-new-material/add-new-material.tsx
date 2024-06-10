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
          <Button className="bg-[#004b24] ml-auto flex items-center">
            <Plus /> Thêm mới
          </Button>
        </DialogTrigger>
        <DialogContent className=" max-w-[825px]">
          <DialogHeader>
            <DialogTitle>Thêm mới nguyên liệu</DialogTitle>
          </DialogHeader>
          <AddNewMeterialForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
