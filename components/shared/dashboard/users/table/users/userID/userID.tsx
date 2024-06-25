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

        fetchDataUserId()

    }, [roleId, value, isActive, currentPage, pageSize, params.id])


    console.log('iddd', userId)


    return (
        <Card className="" >
            <Toaster />
            <div className="bg-white flex justify-between  w-full ">
                <div >
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
                            {/* <Pencil size={25} /> */}
                        </div>
                    </header>

                </div>
            </div>
        </Card >
    );
}