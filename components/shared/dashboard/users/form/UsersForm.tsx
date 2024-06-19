"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast, { Toaster } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import { UsersSchema } from "@/schema";
import { userApi } from "@/apis/user.api";
import { useRouter } from "next/navigation";
import { MyContext } from "../table/users/RenderTable";

interface UsersFormProps {
  setOpen: (open: boolean) => void;
}

export const UsersForm: React.FC<UsersFormProps> = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ** Hooks
  const router = useRouter();
  const { forceUpdate } = useContext(MyContext);

  const form = useForm({
    resolver: zodResolver(UsersSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      address: "",
      phone: "",
      password: "",
      roleId: 1,
      isActive: true,
      companyId: "",
      id: "",
      salaryByDay: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof UsersSchema>) => {
    const {
      firstName,
      lastName,
      dob,
      gender,
      address,
      phone,
      password,
      roleId,
      isActive,
      companyId,
      id,
      salaryByDay,
    } = data;
    setLoading(true);
    console.log('dataCreateUser',data)
    userApi
      .createUser({
        firstName,
        lastName,
        dob,
        gender,
        address,
        phone,
        password,
        roleId,
        isActive,
        companyId,
        id,
        salaryByDay,
      })
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success(data.message);
          setTimeout(() => {
            setOpen(false);
            forceUpdate();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
        console.log(data);
      });
  };

  return (
    <Form {...form}>
      <Toaster />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="space-y-3">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* firstName */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Tên nhân viên*
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* lastName */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Họ Nhân Viên*
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Địa chỉ cư trú
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* salaryByDay */}
            <FormField
              control={form.control}
              name="salaryByDay"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Lương ngày *
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* companyId */}
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Cơ sở nào *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hãy chọn cơ sở" defaultValue={'4f45353f-3ff1-4a0e-b44b-69268ddc63b2'}/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="4f45353f-3ff1-4a0e-b44b-69268ddc63b2">Cơ Sở Sơn Nguyễn</SelectItem>
                    </SelectContent>
                  </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* dob */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-backgroudPrimary">
                    Ngày sinh
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="DD/MM/YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary-backgroudPrimary">
                      Mật khẩu *
                    </FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-backgroudPrimary">
                  Giới tính
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="Male" />
                      </FormControl>
                      <FormLabel className="font-normal">Nam</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="Female" />
                      </FormControl>
                      <FormLabel className="font-normal">Nữ</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />




          {/* pin */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-backgroudPrimary">
                  Số định danh cá nhân/CMND
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={12} {...field}>
                    <InputOTPGroup>
                      {[...Array(12)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="h-1 my-4" />
        <Button
          type="submit"
          className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90"
          disabled={loading}
        >
          {loading ? "Loading..." : "Thêm Nhân Viên"}
        </Button>
      </form>
    </Form>
  );
};
