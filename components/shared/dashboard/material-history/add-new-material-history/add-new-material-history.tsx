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
import AddNewMeterialHistoryForm from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history-form";
export default function AddNewMeterialHistory() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-[#004b24] ml-auto flex items-center">
            <Plus /> Nhập mới
          </Button>
        </DialogTrigger>
        <DialogContent className=" max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-5">Nhập nguyên liệu</DialogTitle>
          </DialogHeader>
          <AddNewMeterialHistoryForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
