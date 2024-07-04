"use client";

// ** import ui
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import LoadingPage from "../loading/loading-page";

// ** import icon
import { ListCollapse, Phone, Globe } from "lucide-react";

// ** import react
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { userApi } from "@/apis/user.api";
import Link from "next/link";

import toast, { Toaster } from "react-hot-toast";
import { Pencil } from "lucide-react";

// ** import hooks
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/shared/dashboard/users/table/users/data/data";
import Image from "next/image";
import { filesApi } from "@/apis/files.api";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
];

export default function ProfilePage() {
  // ** state
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [userId, setUserId] = useState<any>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  // ** hooks
  const user = useAuth();

  // ** call API
  useEffect(() => {
    const fetchDataUserId = () => {
      setLoading(true);
      userApi
        .getUserId(params.id)
        .then((res) => {
          const userData = res.data.data;
          filesApi.getFile(userData.avatar).then((res) => {
            setAvatar(res.data.data);
            console.log("avatar", res.data.data);
          });
          console.log("userData", userData);
          setUserId(userData);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDataUserId();
  }, [params]);

  // console.log("datauserId", userId);

  // ** compare tại khoản của tôi và tài khoản khác
  const getMe: boolean = user.user?.id === userId.id;

  if (!user?.user?.id) {
    return <LoadingPage />;
  }
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  function validatePassword(password: string) {
    // Kiểm tra độ dài tối thiểu
    if (password.length < 6) {
      return false;
    }

    // Kiểm tra có ít nhất một ký tự viết hoa
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      return false;
    }

    // Kiểm tra có ít nhất một ký tự đặc biệt
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    if (!hasSpecialChar) {
      return false;
    }

    // Nếu thỏa mãn tất cả các điều kiện
    return true;
  }
  const handleChangePassword = () => {
    console.log("userId", userId.id);
    console.log("currentPassword", currentPassword);
    console.log("newPassword", newPassword);
    if (currentPassword === "" || newPassword === "") {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error(
        "Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ hoa và ký tự đặc biệt"
      );
      return;
    }
    const data = {
      userId: userId.id,
      oldPassword: currentPassword,
      newPassword: newPassword,
    };
    userApi
      .changePassword(data)
      .then((res) => {
        console.log("res", res);
        toast.success("Đổi mật khẩu thành công");
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        toast.error("Đổi mật khẩu thất bại");
      });
  };
  return (
    <div className="flex flex-col gap-6 justify-center">
      <header className=" flex justify-between">
        {/* Card User  */}
        <div className=" relative w-full max-w-2xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-primary-backgroudPrimary dark:border-gray-400 shadow-lg rounded-lg">
          <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-primary-backgroudPrimary dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
            nhân viên
          </span>

          <div className="w-full flex justify-center sm:justify-start sm:w-auto">
            <Image
              alt="avatar"
              width={80}
              height={80}
              className="object-cover w-20 h-20 mt-3 mr-3 rounded-full"
              src="https://lh3.googleusercontent.com/a/AEdFTp70cvwI5eevfcr4LonOEX5gB2rzx7JnudOcnYbS1qU=s96-c"
            />
          </div>

          <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
            <p className="font-display mb-2 text-xl dark:text-primary  font-semibold">
              {userId?.firstName} {userId?.lastName}
            </p>

            <div className="mb-4 md:text-md text-lg text-gray-400">
              <p>{userId?.address}</p>
            </div>

            <div className="flex gap-4">
              <Phone size={23} />
              <Globe size={23} />
            </div>
          </div>
        </div>

        {/* tính năng của người dùng, chủ .....  */}
        <div className="absolute lg:relative lg:right-0 right-7 ">
          {/* giao diện desktop */}
          <div className="hidden lg:block">
            <Card>
              <CardContent className="p-4 flex flex-col justify-between gap-4">
                <Tabs defaultValue="status">
                  <TabsList className="grid w-[300px] grid-cols-3">
                    <TabsTrigger value="status">Trạng thái</TabsTrigger>
                    <TabsTrigger value="role">Vai trò</TabsTrigger>
                    <TabsTrigger value="edit">Chỉnh sửa</TabsTrigger>
                  </TabsList>
                  <TabsContent value="status">
                    <div className="grid gap-3">
                      <Select>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="role">
                    <Select>
                      <SelectTrigger id="role" aria-label="Select role">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TabsContent>
                  <TabsContent value="edit"></TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* giao diện mobile */}
          <div className="block lg:hidden ">
            <Button
              variant="outline"
              size="icon"
              className="bg-primary text-white m-2 "
            >
              <ListCollapse className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Thông tinh cá nhân */}
      <div className="w-full h-full bg-white p-2 rounded-lg shadow-md dark:bg-card">
        <div className="p-4 flex flex-col justify-between gap-4">
          <Card>
            <CardHeader className="font-semibold text-xl dark:text-primary">
              Thông Tin Cá Nhân
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 grid-rows-2 gap-y-8">
                <div>
                  <div className="font-extralight text-[0.8rem]">Họ và Tên</div>
                  <div>
                    {userId?.firstName} {userId?.lastName}
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">Giới tính</div>
                  <div>{userId?.gender === "Male" ? "Nam" : "Nữ"}</div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">Ngày sinh</div>
                  <div>{formatDate(userId?.dob)}</div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">Địa chỉ</div>
                  <div>{userId?.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold text-xl dark:text-primary">
              Thông Tin Liên Lạc
            </CardHeader>
            <CardContent className="">
              <div>
                <div className="font-extralight text-[0.8rem]">
                  Số điện thoại
                </div>
                <div>
                  {userId?.phone === "" ? "Chưa cập nhật" : userId?.phone}{" "}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold text-xl dark:text-primary">
              Thông Tin Lương
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 grid-rows-2 gap-y-8">
                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Lương công nhật
                  </div>
                  <div>
                    200.000 <span className="text-gray-400">VND/Ngày</span>
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Lương tăng ca
                  </div>
                  <div>
                    30.000 <span className="text-gray-400">VND/giờ</span>
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Lương khả dụng
                  </div>
                  <div>
                    3.500.000 <span className="text-gray-400">VND</span>
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Ngày nhận lương gần nhất
                  </div>
                  <div>28/10/2024</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="font-semibold text-xl dark:text-primary">
              Cơ Sở Làm Việc
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-8">
              <div>
                <div className="font-extralight text-[0.8rem]">Cơ sở</div>
                <div>{userId.companyName}</div>
              </div>

              <div>
                <div className="font-extralight text-[0.8rem]">Vai trò</div>
                <div>
                  {Role.find((role) => role.value === userId.roleId)?.label}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Thông tin tài khoản */}
      <div className="w-full h-full bg-white p-2 rounded-lg shadow-md dark:bg-card">
        <div className="p-4 flex flex-col justify-between gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="dark:text-primary">Mật Khẩu</CardTitle>
              <CardDescription>
                Thay đổi mật khẩu của bạn ở đây. Sau khi lưu, bạn sẽ đăng xuất.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Mật khẩu hiện tại</Label>
                <Input
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                  id="current"
                  type="password"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Mật khẩu mới</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <div id="error" className="text-destructive"></div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleChangePassword}
              >
                Xác nhận thay đổi
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
