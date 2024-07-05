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
  const [focus, setFocus] = React.useState(false);
  console.log("DIALOG", focus);
  return (
    <>
      <Dialog open={focus} onOpenChange={setFocus} modal={true}>
        <DialogTrigger asChild>
          <Button className="bg-[#22c55e] mb-2 ml-auto mt-4 md:col-start-2 xl:col-start-3 xl:mt-0">
            <Plus /> Nhập mới
          </Button>
        </DialogTrigger>
        <DialogContent className=" max-w-[425px] dark:bg-[#1c1917]">
          <DialogDescription></DialogDescription>
          <DialogHeader>
            <DialogTitle className="mb-5">Nhập nguyên liệu</DialogTitle>
          </DialogHeader>
          <AddNewMeterialHistoryForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
