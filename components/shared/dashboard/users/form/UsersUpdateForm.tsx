// ** import UI
import { userApi } from "@/apis/user.api";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, parseISO } from "date-fns";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

// ** import REACT
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UpdateUserForm } from "@/schema";
import { roleApi } from "@/apis/roles.api";
import { filesApi } from "@/apis/files.api";
import ImageDisplayAvatar from "./ImageDisplay";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyApi } from "@/apis/company.api";
import { MyContext } from "@/components/shared/dashboard/users/table/users/RenderTable";

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
import { UserDetailContext } from "@/components/shared/dashboard/users/table/users/userID/userID";
import { UserStore } from "@/components/shared/dashboard/users/user-store";

// ** type

interface UserID {
  userId?: any;
  children?: any;
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
interface SalaryByRequest {
  salary: any;
  startDate: any;
}
interface SalaryHistoryResponse {
  salaryByDayResponses: SalaryByRequest;
  salaryByOverTimeResponses: SalaryByRequest;
}

type User = {
  id: any;
  firstName: any;
  lastName: any;
  phone: any;
  avatar: any;
  address: any;
  gender: any;
  dob: any;
  salaryHistoryResponse: SalaryHistoryResponse;
  companyId: any;
  roleId: any;
};

export const UpdateUser: React.FC<UserID> = ({ userId, children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const { force } = useContext(UserDetailContext);
  const { ForceRenderForUserDetai } = UserStore();
  const handleOffDialogA = () => {
    setOpenAlert(false);
  };

  const { forceUpdate } = useContext(MyContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [roles, setRoles] = useState<
    Array<{
      roleName: string;
      description: string;
      id: string;
    }>
  >([]);

  const [company, setCompany] = useState<Company[]>([]);
  const [imageRequests, setImageRequests] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<File | null>(null);
  const [nameImage, setNameImage] = useState<string | null>(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
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
      if (file.size > 1024 * 1024) {
        // Kiểm tra kích thước tệp > 1MB
        toast.error("Kích cỡ quá 1M. Hãy đăng file nhỏ hơn");
        return;
      }
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
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("receivedFiles", imageUrls);

    try {
      const response = await filesApi.postFiles(formData);
      const fileName = imageUrls.name;
      const { data } = await filesApi.getFile(fileName);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: any) => {
    try {
      const [year, month, day] = dateString.split("-");
      const formattedDay = day.padStart(2, "0");
      const formattedMonth = month.padStart(2, "0");
      return `${formattedDay}/${formattedMonth}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const formatDateData = (dateString: any) => {
    const formattedDate =
      typeof dateString === "string"
        ? dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
        : dateString;

    const parsedDate = parse(formattedDate, "yyyy-MM-dd", new Date());
    return format(parsedDate, "dd/MM/yyyy");
  };

  const form = useForm({
    resolver: zodResolver(UpdateUserForm),
    defaultValues: {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      address: user?.address,
      gender: user?.gender,
      dob: formatDate(user?.dob),
      roleId: user?.roleId,
      companyId: user?.companyId,
      salaryHistoryResponse: {
        salaryByDayResponses: {
          salary:
            user?.salaryHistoryResponse?.salaryByDayResponses?.salary || "",
          startDate:
            formatDate(
              user?.salaryHistoryResponse?.salaryByDayResponses?.startDate
            ) || "",
        },
        salaryByOverTimeResponses: {
          salary:
            user?.salaryHistoryResponse?.salaryByOverTimeResponses?.salary ||
            "",
          startDate:
            formatDate(
              user?.salaryHistoryResponse?.salaryByOverTimeResponses?.startDate
            ) || "",
        },
      },
    },
  });

  // console.log("datetime", form.getValues().salaryHistoryResponse.salaryByDayResponses.startDate)
  useEffect(() => {
    const fetchDataCompany = async () => {
      const { data } = await companyApi.getCompanyByType(0);
      setCompany(data.data);
    };

    const fetchRoleData = () => {
      setLoading(true);
      roleApi
        .getAllRoles()
        .then(({ data }) => {
          setRoles(data.data);
        })
        .catch((error) => {
          // console.error("Error fetching roles data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const fetchDataUserId = () => {
      setLoading(true);
      userApi
        .getUserId(userId)
        .then((res) => {
          const userData = res.data.data;

          setUser(userData);
          const formattedUserData = {
            ...userData,
            dob: formatDate(userData.dob),
            salaryHistoryResponse: {
              salaryByDayResponses: {
                salary:
                  userData?.salaryHistoryResponse?.salaryByDayResponses
                    ?.salary || "",
                startDate: formatDate(
                  userData?.salaryHistoryResponse?.salaryByDayResponses
                    ?.startDate || ""
                ),
              },
              salaryByOverTimeResponses: {
                salary:
                  userData?.salaryHistoryResponse?.salaryByOverTimeResponses
                    ?.salary || "",
                startDate: formatDate(
                  userData?.salaryHistoryResponse?.salaryByOverTimeResponses
                    ?.startDate || ""
                ),
              },
            },
          };
          filesApi.getFile(userData.avatar).then(({ data }) => {
            setImageRequests(data.data);
          });
          form.reset(formattedUserData);
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    };

    fetchDataCompany();
    fetchRoleData();
    if (userId) {
      fetchDataUserId();
    }
  }, [userId, fetchTrigger, form, force]);

  const formatCurrency = (value: any): string => {
    if (!value) return "";
    let valueString = value.toString();
    valueString = valueString.replace(/\D/g, "");
    valueString = valueString.replace(/^0+/, "");
    if (valueString === "") return "0";
    let reversed = valueString.split("").reverse().join("");
    let formattedReversed = reversed.match(/.{1,3}/g)?.join(".") || "";
    let formatted = formattedReversed.split("").reverse().join("");
    return formatted;
  };

  const onSubmit = async (data: z.infer<typeof UpdateUserForm>) => {
    try {
      setLoading(true);

      // Format startDate của salaryByDayRequest
      const formattedSalaryByDayRequest = {
        salary: Number(
          data.salaryHistoryResponse.salaryByDayResponses.salary.replace(
            /\./g,
            ""
          )
        ),
        startDate: formatDateData(
          data.salaryHistoryResponse.salaryByDayResponses.startDate
        ),
      };

      // Format startDate của salaryOverTimeRequest
      const formattedSalaryOverTimeRequest = {
        salary: Number(
          data.salaryHistoryResponse.salaryByOverTimeResponses.salary.replace(
            /\./g,
            ""
          )
        ),
        startDate: formatDateData(
          data.salaryHistoryResponse.salaryByOverTimeResponses.startDate
        ),
      };

      // Tạo đối tượng dữ liệu đã format
      const formattedData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        avatar: nameImage === null ? user?.avatar : nameImage,
        address: data.address,
        gender: data.gender,
        dob: formatDateData(data.dob),
        salaryByDayRequest: formattedSalaryByDayRequest,
        salaryOverTimeRequest: formattedSalaryOverTimeRequest,
        companyId: data.companyId,
        roleId: data.roleId,
      };
      // console.log("formattedData", formattedData)
      // Đợi cho ảnh được tải lên trước
      await handlePostImage();

      // Sau khi ảnh đã được tải lên, gửi yêu cầu cập nhật người dùng
      const response = await userApi.userUpdate(formattedData);
      if (response.data.isSuccess) {
        forceUpdate();
        setOpen(false);
        ForceRenderForUserDetai();
        toast.success(response.data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error) {
          for (const key in error.response.data.error) {
            toast.error(error.response.data.error[key][0]);
          }
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setOpen(false);
    setOpenAlert(false);
    setFetchTrigger((prev) => prev + 1);
  };

  const { formState } = form;
  const handleOffDialog = () => {
    if (!formState.isDirty) {
      setOpen(false);
      setFetchTrigger((prev) => prev + 1);
    } else {
      setOpenAlert(true);
    }
  };
  return (
    <>
      {openAlert && (
        <AlertDialog open={openAlert}>
          <AlertDialogTrigger className="hidden "></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn tắt biểu mẫu này không ??
              </AlertDialogTitle>
              <AlertDialogDescription>
                Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
                những dữ liệu mà bạn đã nhập
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleOffDialogA}>
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleClearForm}>
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Dialog.Root open={open} onOpenChange={handleOnDialog}>
        <Dialog.Trigger className="w-full">
          <div onClick={handleOnDialog}>{children}</div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
            <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2  max-w-[1100px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
              <Dialog.Title className="hidden visible"></Dialog.Title>
              <Dialog.Description className="hidden visible"></Dialog.Description>
              <div className="bg-slate-100  flex flex-col rounded-md">
                <div className="p-4 flex items-center justify-between bg-primary rounded-md ">
                  <h2 className="text-2xl text-white">
                    Chỉnh sửa thông tin nhân viên
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleOffDialog}
                  >
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
                      <div className="space-y-3">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
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
                                          <InputOTP
                                            maxLength={12}
                                            {...field}
                                            disabled
                                          >
                                            <InputOTPGroup className="w-full xl:w-[350px]">
                                              {[...Array(12)].map(
                                                (_, index) => (
                                                  <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                  />
                                                )
                                              )}
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
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
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-y-5 sm:gap-x-5 ">
                          <Card className="sm:w-[50%] w-full">
                            <CardContent className="mt-5 space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
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
                                            value={String(field.value)}
                                            onValueChange={(value) => {
                                              field.onChange(parseInt(value));
                                            }}
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
                            </CardContent>
                          </Card>

                          {/* tính lương  */}
                          <Card className="sm:w-[50%] w-full">
                            <CardContent className="mt-5 flex flex-col gap-2">
                              {/* salaryByDayRequest */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="salaryHistoryResponse.salaryByDayResponses.salary"
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
                                  name="salaryHistoryResponse.salaryByDayResponses.startDate"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                        Ngày bắt đầu *
                                      </FormLabel>
                                      <Popover
                                        modal={true}
                                        open={open1}
                                        onOpenChange={setOpen1}
                                      >
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
                                            onSelect={(date: any) => {
                                              setOpen1(false);
                                              field.onChange(
                                                format(date, "dd/MM/yyyy")
                                              );
                                            }}
                                            // disabled={(date) =>
                                            //   date > new Date() || date < new Date("1900-01-01")
                                            // }
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
                                  name="salaryHistoryResponse.salaryByOverTimeResponses.salary"
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
                                            value={formatCurrency(field.value)}
                                            onChange={(e) => {
                                              const rawValue =
                                                e.target.value.replace(
                                                  /[^\d.]/g,
                                                  ""
                                                );
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
                                  name="salaryHistoryResponse.salaryByOverTimeResponses.startDate"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                      <FormLabel className="flex items-center text-primary-backgroudPrimary">
                                        Ngày bắt đầu *
                                      </FormLabel>
                                      <Popover
                                        modal={true}
                                        open={open2}
                                        onOpenChange={setOpen2}
                                      >
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
                                            onSelect={(date: any) => {
                                              setOpen2(false);
                                              field.onChange(
                                                format(date, "dd/MM/yyyy")
                                              );
                                            }}
                                            // disabled={(date) =>
                                            //   date > new Date() || date < new Date("1900-01-01")
                                            // }
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

                      <Separator className="h-1 my-1" />
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý" : "Cập nhật thông tin"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
