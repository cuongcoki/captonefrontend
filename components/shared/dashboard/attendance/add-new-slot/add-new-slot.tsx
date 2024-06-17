import AddNewAttendanceSlotForm from "@/components/shared/dashboard/attendance/add-new-slot/add-new-slot-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import React from "react";

export default function AddNewAttendanceSLot() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-[#004b24] ml-auto text-wrap">
            <Plus /> Tạo báo cáo mới
          </Button>
        </DialogTrigger>
        <DialogContent
          className=" max-w-[825px] max-h-[600px] overflow-auto"
          style={{
            msOverflowStyle: "none" /* IE, Edge */,
            scrollbarWidth: "none" /* Firefox */,
          }}
        >
          <style jsx>{`
            .dialog-content::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <DialogHeader>
            <DialogTitle className="mb-5">
              Tạo báo cáo điểm danh mới
            </DialogTitle>
          </DialogHeader>
          <AddNewAttendanceSlotForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
