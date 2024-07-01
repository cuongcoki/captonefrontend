"use client";

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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast, { Toaster } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ** import React
import { useRouter } from "next/navigation";
import { MyContext } from "../table/users/RenderTable";
import { useContext, useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** import Api
import { filesApi } from "@/apis/files.api";
import { userApi } from "@/apis/user.api";
import { orderApi } from "@/apis/order.api";

// ** import Component
import { UsersSchema } from "@/schema";
import ImageDisplayAvatar from "./ImageDisplay";

interface UsersFormProps {
  setOpen: (open: boolean) => void;
}

type Company = {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyType: number;
  companyTypeDescription: string;
};

const enumRole = [
  {
    roleName: "COUNTER",
    decription: "Quản lý số lượng",
    id: "3",
  },
  {
    roleName: "DRIVER",
    decription: "Người vận chuyển",
    id: "4",
  },
  {
    roleName: "USER",
    decription: "Nhân viên",
    id: "5",
  },
  {
    roleName: "BRANCH_ADMIN",
    decription: "Quản lý cơ sở",
    id: "2",
  },
  {
    roleName: "MAIN_ADMIN",
    decription: "Quản lý hệ thống",
    id: "1",
  },
];

export const UsersForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOffDialog = () => {
    setOpen(false);
  };
  const handleOnDialog = () => {
    setOpen(true);
  };

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [company, setCompany] = useState<Company[]>([]);
  const [imageRequests, setImageRequests] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<File | null>(null);
  const [nameImage, setNameImage] = useState<string | null>(null);

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

  // ** các hàm để sử lý đăng ảnh

  const generateRandomString = (length: number = 5) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  // ** Xử lý khi người dùng tải lên hình ảnh mới
  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const newImageRequest = URL.createObjectURL(file);
      setImageRequests(newImageRequest);
      const extension = file.name.substring(file.name.lastIndexOf("."));

      const randomString = generateRandomString();
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      const second = date.getSeconds().toString().padStart(2, "0");

      const changedFileName = `images-${randomString}-${year}${month}${day}${hour}${minute}${second}${extension}`;
      const newFile = new File([file], changedFileName, { type: file.type });
      setImageUrls(newFile);
      setNameImage(changedFileName);
      console.log("imageUrls", imageUrls);
    }
  };

  // ** Xử lý khi người dùng xóa một hình ảnh đã có
  const handleDeleteImage = () => {
    setImageRequests(null);
    setImageUrls(null);
  };
  // ** Xử lý khi đăng ảnh
  const handlePostImage = async () => {
    if (!imageUrls) {
      console.error("No image selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("receivedFiles", imageUrls); // Đảm bảo rằng tên trường tương ứng với server và chỉ đăng một ảnh

    try {
      const response = await filesApi.postFiles(formData); // Gọi API đăng tệp lên server
      // console.log('Upload successful:', response.data);
      // Xử lý các hành động sau khi tải lên thành công
      const fileName = imageUrls.name; // Lấy tên tệp của ảnh đầu tiên
      const { data } = await filesApi.getFile(fileName);

      // Assuming data.data contains the image name
      // const names = data.data;
      // setNameImage(fileName);
    } catch (error) {
      console.error("Error uploading files:", error);
      // Xử lý lỗi khi tải lên không thành công
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      const { data } = await orderApi.getAllCompanis(
        currentPage,
        pageSize,
        searchTerm
      );
      setCompany(data.data.data);
    };
    fetchCompanyData();
  }, []);

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
    console.log("dataCreateUser", data);
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

  const formatCurrency = (value: any) => {
    if (!value) return value;
    const number = Number(value.replace(/[^0-9]/g, ""));
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const [formattedValue, setFormattedValue] = useState("");

  const onChangeHandler = (e: any) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    const formatted = formatCurrency(numericValue);
    setFormattedValue(formatted);
    form.setValue("salaryByDay", Number(numericValue), {
      shouldValidate: true,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOnDialog}>
      <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
        <Plus onClick={handleOnDialog} className="" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
          <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2  max-w-[1100px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
            <div className="bg-slate-100  flex flex-col ">
              <div className="p-4 flex items-center justify-between bg-primary-backgroudPrimary  ">
                <h2 className="text-2xl text-white">Thêm nhân viên</h2>
                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid gap-4 p-4 overflow-y-auto h-[650px]">
                <Form {...form}>
                  {/* <Toaster /> */}
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
                        <Card className="w-full h-full md:col-span-2 col-span-1 relative">
                          <div className="w-full h-full flex justify-center items-center p-3">
                            {imageRequests === null ? (
                              <div className="w-full h-full flex justify-center items-center">
                                <input
                                  id="image"
                                  type="file"
                                  style={{ display: "none" }}
                                  accept="image/*"
                                  onChange={(e) => handleUploadPhoto(e)}
                                />
                                <label
                                  htmlFor="image"
                                  className="flex flex-col items-center cursor-pointer"
                                >
                                  <Upload
                                    size={70}
                                    className="text-white bg-primary-backgroudPrimary rounded-md p-5 mb-2"
                                  />
                                  <span className="text-l text-gray-500 font-medium">
                                    Hãy tải ảnh lên
                                  </span>
                                </label>
                              </div>
                            ) : (
                              <div className="relative w-full h-full flex justify-center items-center">
                                <ImageDisplayAvatar
                                  images={imageRequests}
                                  onDelete={handleDeleteImage}
                                />
                              </div>
                            )}
                          </div>
                        </Card>

                        <Card className="md:col-span-5 col-span-1">
                          <CardContent className="relative">
                            <div className="grid grid-cols-1 gap-2">
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

                              {/* CMND/CCCD */}
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
                                            <InputOTPSlot
                                              key={index}
                                              index={index}
                                            />
                                          ))}
                                        </InputOTPGroup>
                                      </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* roleId */}
                              <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormLabel className="text-primary-backgroudPrimary">
                                        Vai trò nào *
                                      </FormLabel>
                                      <Select
                                        onValueChange={(value) =>
                                          field.onChange(Number(value))
                                        }
                                        defaultValue={String(field.value)}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue
                                              defaultValue={String(field.value)}
                                            />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {enumRole.map((item, index) => (
                                            <SelectItem
                                              value={String(item.id)}
                                              key={index}
                                            >
                                              {item.decription}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardContent>
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
                                      <Input
                                        type="text"
                                        {...field}
                                        value={formattedValue}
                                        onChange={onChangeHandler}
                                      />
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
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue
                                            placeholder="Hãy chọn cơ sở"
                                            defaultValue={field.value}
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {company.map((item) => (
                                          <SelectItem
                                            value={item.id}
                                            key={item.id}
                                          >
                                            {item.name}
                                          </SelectItem>
                                        ))}
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
                                    <Input
                                      type="text"
                                      placeholder="DD/MM/YYYY"
                                      {...field}
                                    />
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
                                      <FormLabel className="font-normal">
                                        Nam
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <RadioGroupItem value="Female" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Nữ
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
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
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
