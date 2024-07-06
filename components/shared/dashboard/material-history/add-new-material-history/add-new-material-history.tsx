import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddNewMeterialHistoryForm from "@/components/shared/dashboard/material-history/add-new-material-history/add-new-material-history-form";
import { Button } from "@/components/ui/button";

export default function AddNewMeterialHistory() {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <Button
        className="bg-[#22c55e] mb-2 ml-auto mt-4 md:col-start-2 xl:col-start-3 xl:mt-0"
        onClick={openDialog}
      >
        <Plus /> Nhập mới
      </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeDialog}
          ></div>
          <div className="relative bg-white dark:bg-[#1c1917] p-4 rounded min-w-[425px] mx-2 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl text-[#22c55e] w-full text-center">
                Nhập nguyên liệu
              </h2>
              <button
                onClick={closeDialog}
                className="text-black dark:text-white"
              >
                X
              </button>
            </div>
            <AddNewMeterialHistoryForm />
          </div>
        </div>
      )}
    </>
  );
}
