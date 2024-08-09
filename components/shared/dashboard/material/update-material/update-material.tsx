import React from "react";
import { Button } from "@/components/ui/button";
import {  X } from "lucide-react";
import UpdateMaterialForm from "@/components/shared/dashboard/material/update-material/update-material-form";

import ConfirmAlertDialog from "@/components/shared/common/confirm-alert-dialog/confirm-alert-dialog";
import { CardHeader, CardTitle } from "@/components/ui/card";
type UpdateMaterialContextType = {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};
export const UpdateMaterialContext =
  React.createContext<UpdateMaterialContextType>({
    setIsUpdate: () => {},
  });
export default function UpdateMaterial({
  children,
  id,
}: {
  children: any;
  id: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [isUpdate, setIsUpdate] = React.useState(false);
  let handleAlertDialog = (value: boolean) => {
    if (isUpdate) {
      document.getElementById("alert-dialog-trigger")?.click();
      setIsUpdate(false);
      return;
    }
    setOpen(value);
  };
  return (
    <>
      <div
        className="flex justify-center"
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-[#0000002a]"
            onClick={() => {
              handleAlertDialog(false);
            }}
          ></div>
          <div className="relative bg-white dark:bg-[#1c1917] p-4 rounded  max-w-[340px] md:max-w-[700px] mx-2 shadow-lg">
            <div className="flex justify-between items-center mb-3">
            <CardHeader className="w-full">
                <CardTitle className="text-primary w-full text-center">
                  Cập Nhật Nguyên Vật Liệu
                </CardTitle>
              </CardHeader>
              <Button
                onClick={() => {
                  handleAlertDialog(false);
                }}
                className="text-black dark:text-white"
              >
                <X className="w-4 h-4 dark:text-white" />
              </Button>
            </div>
            <UpdateMaterialContext.Provider value={{ setIsUpdate }}>
              <UpdateMaterialForm id={id} />
            </UpdateMaterialContext.Provider>
          </div>
          <ConfirmAlertDialog
            handleAccept={() => {
              setOpen(false);
              setIsUpdate(false);
            }}
          >
            <div id="alert-dialog-trigger"></div>
          </ConfirmAlertDialog>
        </div>
      )}
    </>
  );
}
