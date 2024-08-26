"use client";
import { userApi } from "@/apis/user.api";
import { Employee } from "@/components/shared/dashboard/users/table/users/Column";
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
import { MyContext } from "./RenderTable";
import { useContext } from "react";
import toast from "react-hot-toast";

type Props = {
  user: Employee;
  setIsOpen?: (isOpen: boolean) => void;
};

export default function UserBanButton({ user, setIsOpen }: Props) {
  const { forceUpdate } = useContext(MyContext);
  const handleClick = () => {
    userApi
      .changeUserStatus(user.id, !user.isActive)
      .then((data) => {
        if (setIsOpen) {
          setIsOpen(false);
        }
        // console.log("changeUserStatus", data);
        forceUpdate();
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          for (const key in error?.response?.data?.error) {
            toast.error(error?.response?.data?.error[key][0]);
          }
        } else {
          toast.error(error?.response?.data?.message);
        }
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <Button
          variant={"outline"}
          className="border-none w-full flex items-start justify-start"
        >
          {user.isActive ? "Nghỉ việc" : "Làm lại"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Bạn có muốn chuyển trạng thái của ${user.firstName} ${user.lastName} không?`}</AlertDialogTitle>
          <AlertDialogDescription>
            Sau khi chuyển bạn vẫn có thể đổi lại được
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Tiếp tục</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
