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
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  user: Employee;
};

export default function UserEditButton({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const data: UserUpdateFormType = {
    ...user,
    facility: user?.facilityID?.toString(),
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
      facility: data.facility,
      id: data.id,
      salaryByDay: data.salaryByDay,
    },
  });

  const onSubmit = (updateUser: UserUpdateFormType) => {
    userApi
      .updateUser(updateUser)
      .then((data) => {
        toast.success(data.data.message);
        setIsOpen(false);
      })
      .catch((error) => {
        console.log("UpdateError", error);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Chỉnh sửa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
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
                label="Ngày tháng năm sinh (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="gender"
                label="Giới tính (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="address"
                label="Địa chỉ (*)"
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
                name="facility"
                label="Cơ sở (*)"
              />
              <AppUserInput
                formControl={form.control}
                name="id"
                label="Căn cước công dân (*)"
              />
              <DialogFooter>
                <Button type="submit">Chỉnh sửa</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
