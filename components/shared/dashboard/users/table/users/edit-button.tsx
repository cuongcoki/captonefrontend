"use client";

import { userApi } from "@/apis/user.api";
import { Employee } from "@/components/shared/dashboard/users/table/users/Column";
import AppUserInput from "@/components/shared/dashboard/users/table/users/user-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { formatDate } from "@/lib/utils";
import { UserUpdateFormType, UserUpdateSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { MyContext } from "./RenderTable";

type Props = {
  user: Employee;
};

export default function UserEditButton({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { forceUpdate } = useContext(MyContext);
  const data: UserUpdateFormType = {
    ...user,
    companyId: user?.companyId?.toString(),
  };
  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      dob: formatDate(data.dob),
      gender: data.gender,
      address: data.address,
      phone: data.phone,
      roleId: data.roleId,
      companyId: data.companyId,
      id: data.id,
      salaryByDay: data.salaryByDay,
    },
  });

  const onSubmit = (updateUser: UserUpdateFormType) => {
    userApi
      .updateUser(updateUser)
      .then((data) => {
        toast.success(data.data.message);
        setTimeout(() => {
          setIsOpen(false);
          forceUpdate();
          // window.location.href = '/dashboard/user';
        }, 2000);
      })
      .catch((error) => {
        console.log("UpdateError", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >

      <DialogTrigger asChild>
        <Button variant="outline" className="border-none w-full flex items-center justify-center ">Chỉnh sửa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Thay Đổi thông tin của Nhân viên</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <Toaster />
          <Form {...form}>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <AppUserInput
                formControl={form.control}
                name="firstName"
                label="Tên nhân viên (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="lastName"
                label="Họ nhân viên (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="dob"
                label="Ngày sinh (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="gender"
                label="Giới tính (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="address"
                label="Địa chỉ cư trú (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="phone"
                label="Số điện thoại (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="salaryByDay"
                label="Lương theo ngày (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="companyId"
                label="Cơ sở (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="id"
                label="Số định danh cá nhân/CMND (*)"
              />
              <DialogFooter>
                <Button type="submit" className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90" >Chỉnh sửa</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
