import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
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
import AddNewMeterialForm from "@/components/shared/dashboard/material/add-new-material/add-new-material-form";
import { AddNewMaterialStore } from "@/components/shared/dashboard/material/add-new-material/add-new-material-store";
import { set } from "date-fns";
import { CardHeader, CardTitle } from "@/components/ui/card";
export default function AddNewMeterial() {
  const { isOpen, handleDialog, setIsOpen } = AddNewMaterialStore();
  return (
    <>
      <Button
        className="bg-primary flex items-center m-2 ml-auto"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Plus /> Thêm mới
      </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => {
              handleDialog(false);
            }}
          ></div>
          <div className="relative bg-white dark:bg-[#1c1917] p-4 rounded  max-w-[340px] md:max-w-[700px] mx-2 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <CardHeader className="w-full">
                <CardTitle className="text-primary w-full text-center">
                  Thêm Nguyên Vật Liệu Mới
                </CardTitle>
              </CardHeader>
              <Button
                onClick={() => {
                  handleDialog(false);
                }}
                className="text-black dark:text-white"
              >
                <X className="w-4 h-4 dark:text-white" />
              </Button>
            </div>
            <AddNewMeterialForm />
          </div>
        </div>
      )}
    </>
  );
}
