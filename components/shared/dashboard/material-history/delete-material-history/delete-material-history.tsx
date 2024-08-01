import { materiaHistoryApi } from "@/apis/material-history.api";
import { MaterialHistoryContext } from "@/components/shared/dashboard/material-history/table/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export function DeleteMaterialHistory({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { ForceRender } = React.useContext(MaterialHistoryContext);
  const handleDelete = async () => {
    try {
      const res = await materiaHistoryApi.deleteMaterialHistory(id);
      ForceRender();
      setIsOpen(false);
      toast.success("Xóa lịch sử vật liệu thành công");
    } catch (error) {
      toast.error("Xóa lịch sử vật liệu thất bại");
      console.log("error in delete material history", error);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div className="hover:bg-gray-300 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          Xóa
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn xóa lịch sử này?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              await handleDelete();
            }}
          >
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
