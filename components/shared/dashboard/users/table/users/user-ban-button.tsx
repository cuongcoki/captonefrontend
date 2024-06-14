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

type Props = {
  user: Employee;
};

export default function UserBanButton({ user }: Props) {
  const handleClick = () => {
    userApi
      .changeUserStatus(user.id, !user.isActive)
      .then((data) => {
        console.log("changeUserStatus", data);
      })
      .catch((error) => {
        console.log("changeUserStatus", error);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {user.isActive ? "Nghỉ việc" : "Làm lại"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Bạn có muốn chuyển trạng thái của ${user.firstName} ${user.lastName} không`}</AlertDialogTitle>
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
