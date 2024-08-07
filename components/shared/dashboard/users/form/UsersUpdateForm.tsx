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
import toast, { Toaster } from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

// ** import REACT
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UpdateUserForm } from "@/schema";
import { roleApi } from "@/apis/roles.api";
import { error } from "console";
import { orderApi } from "@/apis/order.api";
import { filesApi } from "@/apis/files.api";
import ImageDisplayAvatar from "./ImageDisplay";
import { CalendarIcon, Plus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { companyApi } from "@/apis/company.api";
import { MyContext } from "@/components/shared/dashboard/users/table/users/RenderTable";

// ** type
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  gender: string;
  phone: string;
  companyId: string;
  roleId: number;
}

interface UserID {
  userId?: any;
  children?: any;
}

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

  const handleOffDialog = () => {
    setOpen(false);
    setFetchTrigger((prev) => prev + 1);
  };
  const handleOnDialog = () => {
    setOpen(true);
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
  // console.log("user====", user);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [company, setCompany] = useState<Company[]>([]);
  const [imageRequests, setImageRequests] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<File | null>(null);
  const [nameImage, setNameImage] = useState<string | null>(null);
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
      console.log("data dang anh", data.data);
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

  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return ""; // Hoặc xử lý lỗi khác tùy theo trường hợp
    }
  };
  // Hàm chuyển đổi ngày tháng từ yyyy-MM-dd sang dd/MM/yyyy
  function formatDate2(inputDate: string) {
    // Tách các phần của ngày tháng từ chuỗi nhập vào
    const [year, month, day] = inputDate.split("-");

    // Chuyển đổi thành định dạng dd/MM/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

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
          console.error("Error fetching roles data:", error);
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
          };
          filesApi.getFile(userData.avatar).then(({ data }) => {
            setImageRequests(data.data);
          });
          form.reset(formattedUserData);
          // setFormattedValue(formatCurrency(userData.salaryByDay.toString()));
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchDataCompany();
    fetchRoleData();
    if (userId) {
      fetchDataUserId();
    }
  }, [userId, fetchTrigger]);
  // console.log('imageRequests', imageRequests)
  // console.log('userData', user)

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
            user?.salaryHistoryResponse?.salaryByDayResponses?.startDate || "",
        },
        salaryByOverTimeResponses: {
          salary:
            user?.salaryHistoryResponse?.salaryByOverTimeResponses?.salary ||
            "",
          startDate:
            user?.salaryHistoryResponse?.salaryByOverTimeResponses?.startDate ||
            "",
        },
      },
    },
  });

  const formatDateData = (dateString: any) => {
    // Kiểm tra và chuyển đổi dateString sang định dạng 'yyyy-MM-dd' nếu cần thiết
    const formattedDate =
      typeof dateString === "string"
        ? dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
        : dateString;

    // Phân tích và định dạng lại ngày tháng
    const parsedDate = parse(formattedDate, "yyyy-MM-dd", new Date());
    return format(parsedDate, "dd/MM/yyyy");
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

  const onSubmit = async (data: z.infer<typeof UpdateUserForm>) => {
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
          /\./,
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

    console.log(
      "formattedDataformatte=============dDataformattedDataformattedData",
      formattedData
    );

    try {
      setLoading(true);
      // Đợi cho ảnh được tải lên trước
      await handlePostImage();
      // Sau khi ảnh đã được tải lên, gửi yêu cầu cập nhật người dùng
      const response = await userApi.userUpdate(formattedData);
      console.log("Response data:", response.data);
      forceUpdate();
      setOpen(false);
      toast.success("Cập nhật thành công!");
      // setOpen(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      if (error.response && error.response.data && error.response.data.error) {
        const errors = error.response.data.error;
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
        if (errors.DOB && Array.isArray(errors.DOB)) {
          errors.DOB.forEach((error: any) => {
            toast.error(error);
          });
        }
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOnDialog}>
      <Dialog.Trigger className="w-full">
        <div onClick={handleOnDialog}>{children}</div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto max-h-screen grid place-items-center">
          <Dialog.Content className=" w-full fixed z-50 left-1/2 top-1/2  max-w-[1100px] max-h-[90%]  -translate-x-1/2 -translate-y-1/2 rounded-md bg-white  text-gray-900 shadow">
            <div className="bg-slate-100  flex flex-col rounded-md">
              <div className="p-4 flex items-center justify-between bg-primary rounded-md ">
                <h2 className="text-2xl text-white">
                  Chỉnh sửa thông tin nhân viên
                </h2>
                <Button variant="outline" size="icon" onClick={handleOffDialog}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid gap-4 p-4 overflow-y-auto h-[600px]">
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
                                        <InputOTP maxLength={12} {...field}>
                                          <InputOTPGroup className="w-full xl:w-[350px]">
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
                                          value={field.value.toString()}
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
                                  <FormItem className="flex flex-col ">
                                    <FormLabel className="text-primary">
                                      Ngày bắt đầu *
                                    </FormLabel>
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full pl-3 text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              formatDate2(field.value)
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
                                          onSelect={(date: any) =>
                                            field.onChange(
                                              format(date, "yyyy-MM-dd")
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
                                    <FormLabel className="flex items-center text-primary">
                                      Ngày bắt đầu *
                                    </FormLabel>
                                    <Popover modal={true}>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full pl-3 text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              formatDate2(field.value)
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
                                          onSelect={(date: any) =>
                                            field.onChange(
                                              format(date, "yyyy-MM-dd")
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

                    <Separator className="h-1 my-1" />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Cặp nhật thông tin"}
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
