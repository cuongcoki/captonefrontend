import React from "react";
import { Plus, X } from "lucide-react";
import AddNewMeterialHistoryForm from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history-form";
import { Button } from "@/components/ui/button";

export default function AddNewMeterialHistory() {
  const [open, setOpen] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const handleAlertDialog = (value: boolean) => {
    if (isUpdate) {
      document.getElementById("alert-dialog-trigger")?.click();
      setIsUpdate(false);
      return;
    }
    setOpen(value);
  };

  return (
    <>
      <Button
        className="bg-[#22c55e] mb-2 ml-auto mt-4 md:col-start-2 xl:col-start-3 xl:mt-0"
        onClick={() => handleAlertDialog(true)}
      >
        <Plus /> Nhập mới
      </Button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 ">
          <div
            className="fixed inset-0 bg-black opacity-50 blur-sm backdrop:blur-sm backdrop-blur-md"
            onClick={() => handleAlertDialog(false)}
          ></div>
          <div className="relative bg-white dark:bg-[#1c1917] p-4 rounded min-w-[425px] mx-2 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl text-[#22c55e] w-full text-center">
                Nhập Nguyên Vật Liệu Mới
              </h2>
              <button
                onClick={() => handleAlertDialog(false)}
                className="text-black dark:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AddNewMeterialHistoryForm />
          </div>
        </div>
      )}
    </>
  );
}
