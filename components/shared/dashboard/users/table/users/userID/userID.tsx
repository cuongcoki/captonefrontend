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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ** import icon
import {
  ListCollapse,
  Phone,
  Globe,
  KeyRound,
  Contact,
  PencilLine,
} from "lucide-react";

// ** import react
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "@/apis/user.api";
import Link from "next/link";

import toast, { Toaster } from "react-hot-toast";
import { Pencil } from "lucide-react";

// ** import hooks
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/shared/dashboard/users/table/users/data/data";
import Image from "next/image";
import { filesApi } from "@/apis/files.api";
import { salaryApi } from "@/apis/salary.api";
import { authApi } from "@/apis/auth.api";
import { UpdateUser } from "@/components/shared/dashboard/users/form/UsersUpdateForm";
import LoadingPage from "@/components/shared/loading/loading-page";
import TitleComponent from "@/components/shared/common/Title";
import { UserStore } from "@/components/shared/dashboard/users/user-store";
import { NoImage } from "@/constants/images";

type UserDetailContextType = {
  force: number;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  force: 0,
});

export default function UserIDPage() {
  // ** state
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [userId, setUserId] = useState<any>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const router = useRouter();
  const [isAlertChangeStatus, setIsAlertChangeStatus] =
    useState<boolean>(false);
  const [isAlertChnageRole, setIsAlertChangeRole] = useState<boolean>(false);
  const [roleChosed, setRoleChosed] = useState<string>("");
  const [force, setForce] = useState<number>(0);
  const ForceRender = () => {
    setForce((prev) => prev + 1);
  };
  const { forceForUserDetail } = UserStore();
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
            // console.log("avatar", res.data.data);
          });
          // console.log("userData", userData);
          setUserId(userData);
        })
        .catch((error) => {
          // console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDataUserId();
  }, [params, forceForUserDetail]);

  // console.log("datauserId", userId);

  // ** compare tại khoản của tôi và tài khoản khác
  const getMe: boolean = user.user?.id === userId.id;

  if (!user?.user?.id) {
    return <LoadingPage />;
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
  const handleLogout = () => {
    const id: any = user.user?.id;

    authApi
      .logout(id)
      .then(({ data }) => {
        // console.log("dataLogout", data);
        user.logout();
        router.push("/sign-in");
        // toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
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
        toast.success("Đổi mật khẩu thành công");
        handleLogout();
      })
      .catch((error) => {
        // console.error("Error changing password:", error);
        toast.error("Đổi mật khẩu thất bại");
      });
  };

  const handleChangeActive = () => {
    userApi
      .changeUserStatus(userId.id, !userId.isActive)
      .then((res) => {
        // console.log("res", res);
        toast.success("Thay đổi trạng thái thành công");
        setUserId({
          ...userId,
          isActive: !userId.isActive,
        });
      })
      .catch((error) => {
        // console.error("Error changing user status:", error);
        if (error?.response?.data?.error) {
          for (const key in error?.response?.data?.error) {
            toast.error(error?.response?.data?.error[key][0]);
          }
        } else {
          toast.error(error?.response?.data?.message);
        }
      });
  };

  const handleChangeRole = (roleIdChange: string) => {
    userApi
      .userUpdate({
        id: userId.id,
        avatar: userId.avatar,
        roleId: Number(roleIdChange),
        address: userId.address,
        companyId: userId.companyId,
        dob: formatDate(userId.dob),
        firstName: userId.firstName,
        gender: userId.gender,
        lastName: userId.lastName,
        phone: userId.phone,
        salaryByDayRequest: {
          salary: userId.salaryHistoryResponse.salaryByDayResponses.salary,
          startDate: formatDate(
            userId.salaryHistoryResponse.salaryByDayResponses.startDate
          ),
        },
        salaryOverTimeRequest: {
          salary: userId.salaryHistoryResponse.salaryByOverTimeResponses.salary,
          startDate: formatDate(
            userId.salaryHistoryResponse.salaryByOverTimeResponses.startDate
          ),
        },
      })
      .then((res) => {
        toast.success("Thay đổi vai trò thành công");
        setUserId({
          ...userId,
          roleId: Number(roleIdChange),
        });
        ForceRender();
      })
      .catch((e) => {
        // console.error("Error changing user role:", e);
        toast.error("Thay đổi vai trò thất bại");
      });
  };

  const formatDate = (dateString: string) => {
    const data = dateString?.split("-");
    if (!dateString) return "";
    return `${data[2]}/${data[1]}/${data[0]}`;
  };

  // console.log(user.user);
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

  return (
    <>
      <AlertDialog
        open={isAlertChangeStatus}
        onOpenChange={setIsAlertChangeStatus}
      >
        <AlertDialogTrigger>
          <div></div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn thay đổi trạng thái của nhân viên này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeActive}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isAlertChnageRole} onOpenChange={setIsAlertChangeRole}>
        <AlertDialogTrigger>
          <div></div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn thay đổi vai trò của nhân viên này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleChangeRole(roleChosed)}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-col gap-6 justify-center ">
        <header className=" flex justify-between">
          {/* Card User  */}
          <div className=" relative w-full max-w-2xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-primary-backgroudPrimary dark:border-gray-400 shadow-lg rounded-lg">
            <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-primary-backgroudPrimary dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
              {Role.find((role) => role.value === userId.roleId)?.label}
            </span>

            <div className="w-full flex justify-center sm:justify-start sm:w-auto">
              <Image
                alt="avatar"
                width={80}
                height={80}
                className="object-cover w-20 h-20 mt-3 mr-3 rounded-full"
                src={avatar === "" ? NoImage : avatar}
              />
            </div>

            <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
              <p className="font-display mb-2 text-xl dark:text-primary font-semibold text-primary">
                {userId?.lastName} {userId?.firstName}
              </p>

              <div className="mb-4 text-sm sm:text-md md:text-lg text-center sm:text-start">
                <p className="font-display mb-2 text-lg sm:text-xl dark:text-primary">
                  {userId?.address}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-sm sm:text-base">
                <div className="flex gap-4 text-sm sm:text-base">
                  <Phone size={23} />
                  {userId?.phone === "" ? "Chưa cập nhật" : userId?.phone}
                </div>
                <div className="flex gap-4  text-sm sm:text-base">
                  <Contact size={23} />
                  {userId?.id === "" ? "Chưa cập nhật" : userId?.id}
                </div>
              </div>
            </div>
          </div>

          {/* tính năng của người dùng, chủ .....  */}
          <div className="absolute lg:relative lg:right-0 right-7 ">
            {/* giao diện desktop */}

            {user.user.id !== params.id && user.user?.roleId === 1 && (
              <>
                <div className="hidden lg:block">
                  <Card>
                    <CardContent className="p-4 flex flex-col justify-between gap-4">
                      <Tabs defaultValue="status">
                        <TabsList className="grid w-[300px] grid-cols-3">
                          <TabsTrigger value="status">Trạng thái</TabsTrigger>
                          <TabsTrigger value="role">Vai trò</TabsTrigger>
                          <UserDetailContext.Provider value={{ force }}>
                            <UpdateUser userId={userId.id}>
                              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                Chỉnh sửa
                              </div>
                            </UpdateUser>
                          </UserDetailContext.Provider>
                        </TabsList>
                        <TabsContent value="status">
                          <div className="grid gap-3">
                            <Select
                              value={userId.isActive?.toString()}
                              onValueChange={() => setIsAlertChangeStatus(true)}
                            >
                              <SelectTrigger
                                id="status"
                                aria-label="Select status"
                              >
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Đang làm </SelectItem>
                                <SelectItem value="false">Đã nghỉ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>
                        <TabsContent value="role">
                          <Select
                            value={userId.roleId?.toString()}
                            onValueChange={(value) => {
                              setRoleChosed(value);
                              setIsAlertChangeRole(true);
                            }}
                          >
                            <SelectTrigger id="role" aria-label="Select role">
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                              {Role.map((role) => (
                                <SelectItem
                                  key={role.value}
                                  value={role.value.toString()}
                                >
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TabsContent>
                        <TabsContent value="edit"></TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <div className="block lg:hidden ">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-primary text-white m-2 "
                      >
                        <ListCollapse className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100" align="end">
                      <Card>
                        <CardContent className="p-4 flex flex-col justify-between gap-4">
                          <Tabs defaultValue="status">
                            <TabsList className="grid w-[300px] grid-cols-3">
                              <TabsTrigger value="status">
                                Trạng thái
                              </TabsTrigger>
                              <TabsTrigger value="role">Vai trò</TabsTrigger>
                              <UpdateUser userId={userId.id}>
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                                  Chỉnh sửa
                                </div>
                              </UpdateUser>
                            </TabsList>
                            <TabsContent value="status">
                              <div className="grid gap-3">
                                <Select
                                  value={userId.isActive?.toString()}
                                  onValueChange={handleChangeActive}
                                >
                                  <SelectTrigger
                                    id="status"
                                    aria-label="Select status"
                                  >
                                    <SelectValue placeholder="Chọn trạng thái" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">
                                      Đang làm{" "}
                                    </SelectItem>
                                    <SelectItem value="false">
                                      Đã nghỉ
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TabsContent>
                            <TabsContent value="role">
                              <Select
                                value={userId.roleId?.toString()}
                                onValueChange={(value) => {
                                  handleChangeRole(value);
                                }}
                              >
                                <SelectTrigger
                                  id="role"
                                  aria-label="Select role"
                                >
                                  <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Role.map((role) => (
                                    <SelectItem
                                      key={role.value}
                                      value={role.value.toString()}
                                    >
                                      {role.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TabsContent>
                            <TabsContent value="edit"></TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {/* giao diện mobile */}
          </div>
        </header>

        {/* Thông tinh cá nhân */}
        <div className="p-4 flex flex-col justify-between gap-4">
          <Card>
            <CardHeader>
              <TitleComponent
                title="Thông tin cá nhân"
                description="Thông tin cá nhân của nhân viên."
              />
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 grid-rows-2 gap-y-8">
                <div>
                  <div className="font-extralight text-[0.8rem]">Họ và tên</div>
                  <div>
                    {userId?.lastName} {userId?.firstName}
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
            <CardHeader>
              <TitleComponent
                title="Thông tin lương"
                description="Thông tin lương của nhân viên."
              />
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 grid-rows-2 gap-y-8">
                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Lương công nhật
                  </div>
                  <div>
                    {formatCurrency(
                      userId?.salaryHistoryResponse?.salaryByDayResponses.salary
                    )}{" "}
                    <span className="text-gray-400">VND/Ngày</span>
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Lương tăng ca
                  </div>
                  <div>
                    {formatCurrency(
                      userId?.salaryHistoryResponse?.salaryByOverTimeResponses
                        .salary
                    )}{" "}
                    <span className="text-gray-400">VND/giờ</span>
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Lương khả dụng
                  </div>
                  {/* accountBalance */}
                  <div>
                    {userId?.accountBalance === 0
                      ? 0
                      : formatCurrency(userId?.accountBalance)}{" "}
                    <span className="text-gray-400">VND</span>
                  </div>
                </div>

                <div>
                  <div className="font-extralight text-[0.8rem]">
                    Ngày nhận lương gần nhất
                  </div>
                  <div>
                    {userId?.lastPaidSalaryDate !== "0001-01-01"
                      ? formatDate(userId?.lastPaidSalaryDate)
                      : "Không có"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TitleComponent
                title="Cơ sở làm việc"
                description="Thông tin công ty của nhân viên."
              />
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
    </>
  );
}
