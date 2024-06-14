"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { useState } from "react";

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
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";

import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UsersSchema } from "@/schema";
import { userApi } from "@/apis/user.api";
import { useRouter } from "next/navigation";

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
      facility: "",
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
      facility,
      id,
      salaryByDay,
    } = data;
    setLoading(true);

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
        facility,
        id,
        salaryByDay,
      })
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success(data.message);
          setOpen(false);
          console.log(data);
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

  const { pending } = useFormStatus();
  return (
    <Form {...form}>
      <Toaster />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <div className="gap-3 flex flex-col">
              {/* firstName */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                          Tên nhân viên*
                        </FormLabel>
                        <div className="w-[70%]">
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                          Họ tên nhân viên*
                        </FormLabel>
                        <div className="w-[70%]">
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* dob */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center text-primary-backgroudPrimary">
                        Ngày/tháng/năm sinh
                      </FormLabel>
                      <div className="w-[70%]">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="DD/MM/YYYY"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center text-primary-backgroudPrimary">
                        Giới tính
                      </FormLabel>
                      <div className="w-[70%]">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-start space-x-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Male" />
                              </FormControl>
                              <FormLabel className="font-normal">Nam</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Female" />
                              </FormControl>
                              <FormLabel className="font-normal">Nữ</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                          Địa chỉ, nơi ở
                        </FormLabel>
                        <div className="w-[70%]">
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                          Điện thoại
                        </FormLabel>
                        <div className="w-[70%]">
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                          Mật khẩu *
                        </FormLabel>
                        <div className="w-[70%]">
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* role */}
              {/* <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="flex items-center text-primary-backgroudPrimary">Vai trò *</FormLabel>
                                                <div className="w-[70%]">
                                                    <Select onValueChange={field.onChange} >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a verified email to display" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1">admin</SelectItem>
                                                            <SelectItem value="2">staff</SelectItem>
                                                            <SelectItem value="3">countproduct</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            /> */}

              {/* facility */}
              <FormField
                control={form.control}
                name="facility"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center text-primary-backgroudPrimary">
                          Cơ sở nào *
                        </FormLabel>
                        <div className="w-[70%]">
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* pin */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center text-primary-backgroudPrimary">
                        Số định danh cá nhân/CMND
                      </FormLabel>
                      <div className="w-[70%]">
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
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator className="h-1" />
        <FormLabel className="flex items-center "></FormLabel>
        <Button
          type="submit"
          className="w-full bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90"
          disabled={pending}
        >
          {loading ? "Loading..." : "GỬI"}
        </Button>
      </form>
    </Form>
  );
};
