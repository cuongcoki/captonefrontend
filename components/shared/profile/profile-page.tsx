"use client";

// ** import ui
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ** import icon
import {
  Phone,
  Contact,
  PencilLine,
  Laugh,
  Cake,
  MapPinIcon,
  ContactRound,
} from "lucide-react";

// ** import react
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userApi } from "@/apis/user.api";

import toast from "react-hot-toast";

// ** import hooks
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/shared/dashboard/users/table/users/data/data";
import Image from "next/image";
import { filesApi } from "@/apis/files.api";
import { salaryApi } from "@/apis/salary.api";
import { authApi } from "@/apis/auth.api";
import { UpdateUser } from "@/components/shared/dashboard/users/form/UsersUpdateForm";
import { NoImage } from "@/constants/images";
import TitleComponent from "../common/Title";
import LoadingPage from "../loading/loading-page";
import { UserStore } from "../dashboard/users/user-store";

export default function ProfilePage() {
  // ** state
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const [userId, setUserId] = useState<any>([]);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  // const [lastDay, setLastDay] = useState<string>("");
  const router = useRouter();
  const { forceForUserDetail } = UserStore();
  // ** hooks
  const user = useAuth();
  // useEffect(() => {
  //   salaryApi
  //     .getPaidSalaries({
  //       PageIndex: 1,
  //       PageSize: 1,
  //       UserId: params.id,
  //     })
  //     .then((res) => {
  //       setLastDay(res.data.data.data[0]?.createdAt);
  //     });
  // }, [params.id]);

  // ** call API
  useEffect(() => {
    const fetchDataGetMe = () => {
      setLoading(true);
      userApi
        .getMe(params.id)
        .then((res) => {
          const userData = res.data.data;
          filesApi.getFile(userData.avatar).then((res) => {
            setAvatar(res.data.data);
          });
          setUserId(userData);
        })
        .catch((error) => {})
        .finally(() => {
          setLoading(false);
        });
    };
    fetchDataGetMe();
  }, [params.id, userId?.id, forceForUserDetail]);

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
        user.logout();
        router.push("/sign-in");
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
        if (error?.response?.data?.error) {
          for (const key in error?.response?.data?.error) {
            toast.error(error?.response?.data?.error[key][0]);
          }
        } else {
          toast.error(error?.response?.data?.message);
        }
      });
  };

  const formatDate = (dateString: string) => {
    const data = dateString?.split("-");
    if (!dateString) return "";
    return `${data[2]}/${data[1]}/${data[0]}`;
  };

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

  // console.log("user?.user?.id", user?.user?.id)
  // console.log("userId?.id", userId)
  return (
    <>
      {user?.user?.id === userId?.id ? (
        <div className="flex flex-col gap-6 justify-center">
          <header className=" flex justify-center p-2">
            {/* Card User  */}
            <div className="text-white relative w-full max-w-3xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-primary-backgroudPrimary dark:border-gray-400 shadow-lg bg-primary rounded-lg">
              <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-primary-backgroudPrimary dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
                {Role.find((role) => role.value === userId.roleId)?.label}
              </span>

              <div className="w-full flex flex-col items-center gap-6">
                <div className="w-full flex justify-center items-center">
                  <Image
                    alt="avatar"
                    width={800}
                    height={800}
                    className="object-cover w-36 h-36 mt-3 mr-3 rounded-full"
                    src={avatar === "" ? NoImage : avatar}
                  />
                </div>

                <div className="w-full flex flex-col gap-3 justify-center items-center">
                  <div className="text-lg">
                    {userId?.lastName} {userId?.firstName}
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

              <div className="absolute right-2 top-2 hover:cursor-pointer">
                {userId.roleId === 1 && (
                  <UpdateUser userId={userId.id}>
                    <PencilLine />
                  </UpdateUser>
                )}
              </div>
            </div>
          </header>

          {/* Thông tinh cá nhân */}
          <div className=" flex justify-center">
            <div className="w-full max-w-3xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6  rounded-lg">
              <div className="flex flex-col md:flex-row items-start justify-between w-full gap-6">
                <div className="md:w-[40%] w-full">
                  <Card className="p-2">
                    <CardHeader>
                      <TitleComponent
                        title="Thông tin cá nhân"
                        description="Thông tin cá nhân của nhân viên."
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3 items-center">
                          <ContactRound className="w-6 h-6 flex-shrink-0 text-gray-500" />
                          <div>
                            {userId?.lastName} {userId?.firstName}
                          </div>
                        </div>

                        <div className="flex gap-3 items-center">
                          <Laugh className="w-6 h-6 flex-shrink-0 text-gray-500" />
                          <div>{userId?.gender === "Male" ? "Nam" : "Nữ"}</div>
                        </div>

                        <div className="flex gap-3 items-center">
                          <Cake className="w-6 h-6 flex-shrink-0 text-gray-500" />
                          <div>{formatDate(userId?.dob)}</div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <MapPinIcon className="w-6 h-6 flex-shrink-0 text-gray-500" />
                          <div>{userId?.address}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:w-[60%] w-full flex flex-col gap-6">
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
                              userId?.salaryHistoryResponse
                                ?.salaryByDayResponses?.salary
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
                              userId?.salaryHistoryResponse
                                ?.salaryByOverTimeResponses?.salary
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
                        <div className="font-extralight text-[0.8rem]">
                          Cơ sở
                        </div>
                        <div>{userId.companyName}</div>
                      </div>

                      <div>
                        <div className="font-extralight text-[0.8rem]">
                          Vai trò
                        </div>
                        <div>
                          {
                            Role.find((role) => role.value === userId.roleId)
                              ?.label
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin tài khoản */}
          <div className=" flex justify-center">
            <div className="w-full max-w-3xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6  rounded-lg">
              <Card className="p-2 w-full">
                <CardHeader>
                  <TitleComponent
                    title="Mật Khẩu"
                    description="Thay đổi mật khẩu của bạn ở đây. Sau khi lưu, bạn sẽ đăng xuất."
                  />
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
                  <div className="space-y-1">
                    <Label htmlFor="confirm">Nhập lại mật khẩu mới</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                    />
                    <div id="errorConfirm" className="text-destructive"></div>
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
      ) : (
        <LoadingPage />
      )}
    </>
  );
}
