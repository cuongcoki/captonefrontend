'use client'

// ** import ui
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";
import LoadingPage from "../loading/loading-page";

// ** import icon
import { ListCollapse, Phone, Globe } from "lucide-react";

// ** import react
import { useParams, } from 'next/navigation'
import { useEffect, useState } from "react";
import { userApi } from "@/apis/user.api";
import Link from "next/link";



import toast, { Toaster } from "react-hot-toast";
import { Pencil } from "lucide-react";

// ** import hooks
import { useAuth } from "@/hooks/useAuth";



const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },

]


export default function ProfilePage() {
    // ** state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [userId, setUserId] = useState<any>([])
    // ** hooks
    const user = useAuth();


    // ** call API
    useEffect(() => {
        const fetchDataUserId = () => {
            setLoading(true);
            userApi.getUserId(params.id)
                .then(res => {
                    const userData = res.data.data;
                    setUserId(userData);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }
        fetchDataUserId()
    }, [])

    console.log("datauserId", userId)

    // ** compare tại khoản của tôi và tài khoản khác
    const getMe: boolean = user.user?.id === userId.id;

    if (!user?.user?.id) {
        return <LoadingPage />;
    }
    return (
        <div className="flex flex-col gap-6 justify-center">
            <header className=" flex justify-between">
                {/* Card User  */}
                <div className=" relative w-full max-w-2xl flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-primary-backgroudPrimary dark:border-gray-400 shadow-lg rounded-lg">
                    <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-primary-backgroudPrimary dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
                        nhân viên
                    </span>

                    <div className="w-full flex justify-center sm:justify-start sm:w-auto">
                        <img className="object-cover w-20 h-20 mt-3 mr-3 rounded-full" src="https://lh3.googleusercontent.com/a/AEdFTp70cvwI5eevfcr4LonOEX5gB2rzx7JnudOcnYbS1qU=s96-c" />
                    </div>

                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
                        <p className="font-display mb-2 text-xl text-primary-backgroudPrimary  font-semibold dark:text-gray-200" >{userId?.firstName} {userId?.lastName}</p>

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
                        <Button variant="outline" size="icon" className="bg-primary-backgroudPrimary text-white m-2 ">
                            <ListCollapse className="h-4 w-4" />
                        </Button>
                    </div>
                </div>


            </header >

            {/* Thông tinh cá nhân */}
            <div className="w-full h-full bg-white p-2 rounded-lg shadow-md">
                <div className="p-4 flex flex-col justify-between gap-4">

                    <Card>
                        <CardHeader className="font-semibold text-xl">
                            Thông tin cơ bản
                        </CardHeader>
                        <CardContent className="">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Tên</TableHead>
                                        <TableHead>Họ</TableHead>
                                        <TableHead>Ngày sinh</TableHead>
                                        <TableHead>Điện Thoại</TableHead>
                                        <TableHead>giới tính</TableHead>
                                        <TableHead className="">Địa chỉ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow >
                                        <TableCell className="font-medium">{userId?.firstName} </TableCell>
                                        <TableCell>{userId?.lastName}</TableCell>
                                        <TableCell>{userId?.dob}</TableCell>
                                        <TableCell>{userId?.phone}</TableCell>
                                        <TableCell>{userId?.gender}</TableCell>
                                        <TableCell className="">{userId?.address}</TableCell>
                                    </TableRow>
                                </TableBody>

                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="font-semibold text-xl">
                            Thông tin cơ sở đang làm
                        </CardHeader>
                        <CardContent className="">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Cơ sở</TableHead>
                                        <TableHead className="">Địa chỉ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow >
                                        <TableCell className="font-medium"> HoLa FPT</TableCell>
                                        <TableCell className="">Tổ 4 , phường phú xá thái nguyên</TableCell>
                                    </TableRow>
                                </TableBody>

                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="font-semibold text-xl">
                            Thông tin lương lậu
                        </CardHeader>
                        <CardContent className="">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Lương ngày</TableHead>
                                        <TableHead className="">Lương tháng</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow >
                                        <TableCell className="font-medium"> 2000000000</TableCell>
                                        <TableCell className="">2000000000000</TableCell>
                                    </TableRow>
                                </TableBody>

                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Thông tin tài khoản */}
            <div className="w-full h-full bg-white p-2 rounded-lg shadow-md">
                <div className="p-4 flex flex-col justify-between gap-4">
                    <Card>
                        <CardHeader className="font-semibold text-xl">
                            Thông tin tài khoản & mật khẩu
                        </CardHeader>
                        <CardContent className="">
                            <Tabs defaultValue="account" >
                                <TabsList className="grid w-[300px] grid-cols-2">
                                    <TabsTrigger value="account">Tài khoản</TabsTrigger>
                                    <TabsTrigger value="password">Mật khẩu</TabsTrigger>
                                </TabsList>
                                <TabsContent value="account">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tài khoản</CardTitle>
                                            <CardDescription>
                                                Thực hiện thay đổi cho tài khoản của bạn tại đây. Nhấp vào lưu khi bạn hoàn tất.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="name">CCCD/CMND</Label>
                                                <Input id="name" defaultValue="Pedro Duarte" />
                                            </div>

                                        </CardContent>
                                        <CardFooter>
                                            <Button className="bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90">Xác nhận thay đổi</Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="password">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Mật khẩu</CardTitle>
                                            <CardDescription>
                                                Thay đổi mật khẩu của bạn ở đây. Sau khi lưu, bạn sẽ đăng xuất.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="current">Mật khẩu hiện tại</Label>
                                                <Input id="current" type="password" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="new">Mật khẩu mới</Label>
                                                <Input id="new" type="password" />
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="bg-primary-backgroudPrimary hover:bg-primary-backgroudPrimary/90">Xác nhận thay đổi</Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}

