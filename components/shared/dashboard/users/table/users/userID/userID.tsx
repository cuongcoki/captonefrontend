'use client'
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useParams, } from 'next/navigation'
import { useEffect, useId, useState } from "react";
import { userApi } from "@/apis/user.api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
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
}

export default function UserIDPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [value, setValue] = useState('');
    const [roleId, setRoleId] = useState<number>(1);
    const [isActive, setIsActive] = useState<any>(true);
    const [data, setData] = useState<any>([]);
    const [userId, setUserId] = useState<User>({
        id: "",
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        roleId: 0,
        salaryByDay: 0,
    });
    useEffect(() => {
        fetchData()
        fetchDataUserId()

    }, [])
    const fetchData = () => {
        setLoading(true);
        userApi.allUsers(roleId, value, isActive)
            .then(res => {
                setData(res.data.data.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }


    const fetchDataUserId = () => {
        setLoading(true);
        userApi.getUserId(params.id)
            .then(res => {
                setUserId(res.data.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }


    return (
        <div className="py-2 h-full">
            <div className="bg-white flex justify-between w-full h-full ">
                <div className="w-[10%]">
                    {
                        loading ? (
                            <div className="flex flex-col p-3 ">
                                <div className='my-3 flex flex-col justify-between '>
                                    <Skeleton className="w-full h-[20px]" />
                                    <Skeleton className="w-full h-[20px]" />
                                </div>
                                <div className='my-3 flex flex-col justify-between '>
                                    <Skeleton className="w-full h-[20px]" />
                                    <Skeleton className="w-full h-[20px]" />
                                </div>
                                <div className='my-3 flex flex-col justify-between '>
                                    <Skeleton className="w-full h-[20px]" />
                                    <Skeleton className="w-full h-[20px]" />
                                </div>
                                <div className='my-3 flex flex-col justify-between '>
                                    <Skeleton className="w-full h-[20px]" />
                                    <Skeleton className="w-full h-[20px]" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col p-3 ">
                                {
                                    data.map((dataId: any, index: any) => (
                                        <Link href={`/dashboard/user/users/${dataId.id}`}>
                                            <div key={index} className='my-3 flex flex-col justify-between '>
                                                <span className={cn('btn', { 'font-medium text-xl text-primary-backgroudPrimary mb-5': dataId.id === params.id })}>CMND/CCCD : {dataId.id}</span>
                                                <Separator className={cn('h-[2px]', { 'm bg-primary-backgroudPrimary mb-5': dataId.id === params.id })} />
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>

                <div className="flex-1 border-l-8 border-slate-100">
                    <div className="p-3">
                        <div className="px-4 space-y-6 md:px-6">
                            <header className="space-y-1.5">
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
                            </header>
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

                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">Thay đổi mật khẩu</h2>
                                    <div className="grid grid-cols-1  gap-6">
                                        <div>
                                            <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                            <Input disabled id="current-password" placeholder="Enter your current password" type="password" />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-password">Mật khẩu mới</Label>
                                            <Input disabled id="new-password" placeholder="Enter your new password" type="password" />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                                            <Input disabled id="confirm-password" placeholder="Confirm your new password" type="password" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}