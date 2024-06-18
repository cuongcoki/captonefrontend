'use client'
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useParams, } from 'next/navigation'
import { useEffect, useState } from "react";
import { userApi } from "@/apis/user.api";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { DataTablePagination } from "../data-table-pagination";


import toast, { Toaster } from "react-hot-toast";
import { Pencil } from "lucide-react";
import UserEditButton from "../edit-button";
import { Employee } from "../Column";

interface User {
    firstName: string;
    id: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    phone: string;
    roleId: number;
    salaryByDay: number;
    isActive: boolean;
    facilityID: number;
}

export default function UserIDPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [value, setValue] = useState('');
    const [roleId, setRoleId] = useState<number>(1);
    const [isActive, setIsActive] = useState<any>(true);
    const [data, setData] = useState<any>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(5);
    const [open, setOpen] = useState<boolean>(false);
    const [userId, setUserId] = useState<any>([])

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await userApi.allUsers(roleId, searchTerm, isActive, currentPage, pageSize);
                setData(res.data.data.data);
                setCurrentPage(res.data.data.currentPage);
                setTotalPages(res.data.data.totalPages);
                console.log('Response:', res);
            } catch (error) {
                // console.error('Error fetching user data:', error?.response);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const fetchDataUserId = () => {
            setLoading(true);
            userApi.getUserId(params.id)
                .then(res => {
                    const userData = res.data.data;
                    setUserId(userData);
                    // setUserId(res.data.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchData()
        fetchDataUserId()

    }, [roleId, value, isActive, currentPage, pageSize, params.id])


console.log('iddd',userId)


    return (
        <Card className="" >
            <Toaster />
            <div className="bg-white flex justify-between  w-full ">

                {/* phần sidebar để chuyển trang userId */}
                <div className="hidden md:flex flex-col p-3">
                    <DataTablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                    {
                        data.map((dataId: any, index: any) => (
                            <Link href={`/dashboard/user/${dataId.id}`} key={index}>
                                <Card key={index} className={cn('my-3 p-2 flex flex-col items-start hover:bg-slate-100', { 'font-medium text-l border-primary-backgroudPrimary': dataId.id === params.id })}>
                                    <div className="flex items-center gap-4">
                                        <div className="font-medium dark:text-white flex flex-col justify-center">
                                            <span className={cn('btn', { 'font-medium text-l text-primary-backgroudPrimary': dataId.id === params.id })}>{dataId.id}</span>
                                            <span className={cn('btn', { 'font-medium text-l text-primary-backgroudPrimary mb-5': dataId.id === params.id })}>{dataId.firstName} {dataId.lastName}</span>
                                        </div>
                                    </div>
                                    <Separator className={cn('h-[2px]', { 'm bg-primary-backgroudPrimary': dataId.id === params.id })} />
                                </Card>
                            </Link>
                        ))
                    }
                </div>


                <div className="flex-1 border-l-8 border-slate-100">
                    <div className="p-3">
                        <div className="px-4 space-y-6 md:px-6">
                            {/* phần đầu có ảnh và thông tin và nút chỉnh sữa */}
                            <header className="space-y-1.5 flex justify-between">
                                <div className="flex items-center space-x-4">
                                    <img src={
                                        `${userId.gender === 'Male' ? `https://avatar.iran.liara.run/public/boy?username=${userId.firstName}` :
                                            `https://avatar.iran.liara.run/public/boy?username=${userId.firstName}`}`
                                    }
                                        alt="Avatar" width="96" height="96" className="border rounded-full" />
                                    <div className="space-y-1.5">
                                        <h1 className="text-2xl font-bold">{userId?.lastName} {userId?.firstName}</h1>
                                        <p className="text-gray-500 dark:text-gray-400">{userId?.dob}</p>
                                    </div>
                                </div>

                                <div>
                                    {/* <UserEditButton user={userId as Employee}/> */}
                                    <Pencil size={25}/>
                                </div>
                            </header>

                            {/* hiển thị userId ở đây */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">THÔNG TIN CÁ NHÂN</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Tên</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.firstName}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Tên đệm</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.lastName}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Vai trò</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.roleId}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Ngày sinh</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.dob}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Địa chỉ</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.address}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Giới tính</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.gender}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Số điện thoại</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.phone}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">CMND/CCCD</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.id}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Hoạt động</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {userId?.isActive ? 'Đi làm' : 'Nghỉ việc'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Card >
    );
}