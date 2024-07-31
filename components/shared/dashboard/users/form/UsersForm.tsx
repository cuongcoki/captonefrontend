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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast, { Toaster } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

import * as Dialog from "@radix-ui/react-dialog";
import { CalendarIcon, Plus, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ** import React
import { useRouter } from "next/navigation";
import { MyContext } from "../table/users/RenderTable";
import { ChangeEvent, useContext, useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { companyApi } from "@/apis/company.api";

interface UsersFormProps {
  setOpen: (open: boolean) => void;
}

type SalaryRequest = {
  salary: number;
  startDate: string;
};

type Company = {
  id: string;
  name: string;
  address: string;
  directorName: string;
  directorPhone: string;
  email: string;
  companyType: any;
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
      gender: "Male",
      address: "",
      phone: "",
      password: "",
      roleId: "",
      isActive: true,
      companyId: "",
      id: "",
      avatar: "", // Nếu bạn muốn có giá trị mặc định cho avatar
      salaryByDayRequest: {
        salary: "",
        startDate: "",
      },
      salaryOverTimeRequest: {
        salary: "",
        startDate: "",
      },
    },
  });
  const handleOffDialog = () => {
    setOpen(false);
    form.reset();
  };
  const handleOnDialog = () => {
    setOpen(true);
  };
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
    const fetchDataCompany = () => {
      companyApi.getCompanyByType(0).then(({ data }) => {
        setCompany(data.data);
      });
    };

    fetchDataCompany();
  }, []);
  console.log("compalylll", company);

  const onSubmit = (data: z.infer<typeof UsersSchema>) => {
    // Đảm bảo handlePostImage đã hoàn thành và lấy được nameImage
    handlePostImage().then(() => {
      const avatar = nameImage;
      const requestBody = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        dob: data.dob.trim(),
        gender: data.gender,
        address: data.address.trim(),
        phone: data.phone.trim(),
        password: data.password,
        roleId: Number(data.roleId),
        isActive: data.isActive,
        companyId: data.companyId,
        id: data.id,
        salaryByDayRequest: {
          salary: Number(data.salaryByDayRequest.salary.replace(/\./g, "")),
          startDate: data.salaryByDayRequest.startDate,
        },
        salaryOverTimeRequest: {
          salary: Number(data.salaryOverTimeRequest.salary.replace(/\./g, "")),
          startDate: data.salaryOverTimeRequest.startDate,
        },
        avatar: avatar,
      };

      console.log("requestBody", requestBody);

      setLoading(true);
      // console.log("dataCreateUser", data);

      userApi
        .createUser(requestBody)
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
          if (err.response && err.response.data && err.response.data.error) {
            const errors = err.response.data.error;
            if (errors.Id) {
              toast.error(errors.Id);
            }

            if (errors.Phone) {
              toast.error(errors.Phone);
            }

            if (errors.FirstName) {
              toast.error(errors.FirstName);
            }
            if (errors.LastName) {
              toast.error(errors.LastName);
            }
          } else {
            console.error("Tạo tài khoản không thành công");
          }
        })
        .finally(() => {
          setLoading(false);
          console.log(data);
        });
    });
  };

  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();

    // Remove all non-numeric characters, including dots
    valueString = valueString.replace(/\D/g, "");

    // Remove leading zeros
    valueString = valueString.replace(/^0+/, "");

    if (valueString === "") return "0";

    // Reverse the string to handle grouping from the end
    let reversed = valueString.split("").reverse().join("");

    // Add dots every 3 characters
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";

    // Reverse back to original order
    let formatted = formattedReversed.split("").reverse().join("");

    return formatted;
  };
  return (
    <Dialog.Root open={open} onOpenChange={handleOnDialog}>
      <Dialog.Trigger className="rounded p-2 hover:bg-[#2bff7e] bg-[#24d369] ">
        <Plus onClick={handleOnDialog} className="" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
          <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2  max-w-[1100px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow ">
            <div className="bg-slate-100  flex flex-col rounded-md">
              <div className="p-4 flex items-center justify-between bg-primary rounded-md">
                <h2 className="text-2xl text-white ">Thêm nhân viên</h2>
                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                  <X className="w-4 h-4 dark:text-white" />
                </Button>
              </div>
              <div className="grid gap-4 p-4 overflow-y-auto h-[600px] dark:bg-black">
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
                                    className="text-white bg-primary rounded-md p-5 mb-2"
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
                          <CardContent className="relative mt-5">
                            <div className="grid grid-cols-1 gap-2">
                              <div className="grid grid-cols-2 gap-x-5">
                                {/* firstName */}

                                <FormField
                                  control={form.control}
                                  name="firstName"
                                  render={({ field }) => {
                                    return (
                                      <FormItem>
                                        <FormLabel className="text-primary">
                                          Họ nhân viên *
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
                                        <FormLabel className="text-primary">
                                          Tên nhân viên *
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
                              <div className="flex items-center gap-x-10">
                                {/* CMND/CCCD */}
                                <FormField
                                  control={form.control}
                                  name="id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-primary">
                                        CCCD/CMND *
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
                                {/* gender */}
                                <FormField
                                  control={form.control}
                                  name="gender"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-primary">
                                        Giới tính *
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
                              </div>
                              <div className="grid grid-cols-2 gap-x-6">
                                {/* dob */}
                                <FormField
                                  control={form.control}
                                  name="dob"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-primary">
                                        Ngày sinh *
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
                                        <FormLabel className="text-primary">
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
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="flex gap-x-5">
                        <Card className="w-[50%]">
                          <CardContent className="mt-5 flex flex-col gap-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* address */}
                              <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
                                        Địa chỉ cư trú *
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
                                      <FormLabel className="flex items-center text-primary">
                                        Số điện thoại *
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
                              {/* companyId */}
                              <FormField
                                control={form.control}
                                name="companyId"
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
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
                              {/* role */}
                              <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
                                        Vai trò *
                                      </FormLabel>
                                      <FormControl>
                                        <Select
                                          value={field.value}
                                          onValueChange={field.onChange}
                                        >
                                          <SelectTrigger>
                                            <SelectValue
                                              placeholder="Hãy chọn vai trò"
                                              defaultValue={field.value}
                                            />
                                            <SelectContent>
                                              <SelectItem
                                                className="hover:bg-gray-100"
                                                value="1"
                                              >
                                                Quản lý hệ thống
                                              </SelectItem>
                                              <SelectItem
                                                className="hover:bg-gray-100"
                                                value="2"
                                              >
                                                Quản lý cơ sở
                                              </SelectItem>
                                              <SelectItem
                                                className="hover:bg-gray-100"
                                                value="3"
                                              >
                                                Quản lý số lượng
                                              </SelectItem>
                                              <SelectItem
                                                className="hover:bg-gray-100"
                                                value="4"
                                              >
                                                Nhân viên vận chuyển
                                              </SelectItem>
                                              <SelectItem
                                                className="hover:bg-gray-100"
                                                value="5"
                                              >
                                                Nhân viên thường
                                              </SelectItem>
                                            </SelectContent>
                                          </SelectTrigger>
                                        </Select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                          </CardContent>
                        </Card>

                        {/* tính lương  */}
                        <Card className="w-[50%]">
                          <CardContent className="mt-5 flex flex-col gap-2">
                            {/* salaryByDayRequest */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="salaryByDayRequest.salary"
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormLabel className="flex items-center text-primary">
                                        Lương ngày *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          {...field}
                                          value={formatCurrency(field.value)} // Hiển thị lương đã format
                                          onChange={(e) => {
                                            const rawValue =
                                              e.target.value.replace(
                                                /[^\d.]/g,
                                                ""
                                              ); // Loại bỏ các ký tự không phải số hoặc dấu chấm
                                            field.onChange(rawValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />
                              <FormField
                                control={form.control}
                                name="salaryByDayRequest.startDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center text-primary">
                                      Ngày bắt đầu *
                                    </FormLabel>
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[240px] pl-3 text-left font-normal",
                                              !field.value &&
                                              "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              field.value
                                            ) : (
                                              <span>Chọn ngày</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          onDayClick={(date: any) =>
                                            field.onChange(
                                              format(date, "dd/MM/yyyy")
                                            )
                                          }
                                          disabled={(date) =>
                                            date < new Date("2024-01-01")
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* salaryOverTimeRequest */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="salaryOverTimeRequest.salary"
                                render={({ field }) => {
                                  return (
                                    <FormItem>
                                      <FormLabel className="flex items-center  text-primary">
                                        Lương làm thêm giờ *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          {...field}
                                          value={formatCurrency(field.value)} // Hiển thị lương đã format
                                          onChange={(e) => {
                                            const rawValue =
                                              e.target.value.replace(
                                                /[^\d.]/g,
                                                ""
                                              ); // Loại bỏ các ký tự không phải số hoặc dấu chấm
                                            field.onChange(rawValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  );
                                }}
                              />

                              <FormField
                                control={form.control}
                                name="salaryOverTimeRequest.startDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center  text-primary">
                                      Ngày bắt đầu *
                                    </FormLabel>
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[240px] pl-3 text-left font-normal",
                                              !field.value &&
                                              "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              field.value
                                            ) : (
                                              <span>Chọn ngày</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                      >
                                        <Calendar
                                          mode="single"
                                          selected={
                                            field.value
                                              ? parse(
                                                field.value,
                                                "dd/MM/yyyy",
                                                new Date()
                                              )
                                              : undefined
                                          }
                                          onDayClick={(date: any) =>
                                            field.onChange(
                                              format(date, "dd/MM/yyyy")
                                            )
                                          }
                                          disabled={(date) =>
                                            date < new Date("2024-01-01")
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator className="h-1" />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
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
