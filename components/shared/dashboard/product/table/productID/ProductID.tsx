'use client'

// ** import react
import Link from "next/link";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";


// ** import UI
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// ** import api 

export default function ProductIDPage() {
    const params = useParams<{ id: string }>()

    //state
    const [loading, setLoading] = useState<boolean>(false);
    return (
        <Card className="" >
            <div className="bg-white flex justify-between h-[825px] w-full overflow-auto">
                <div className="w-[20%]">
                    <div className="flex flex-col p-3  overflow-auto h-[825px]">
                        {/* <DataTablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                        {
                            data.map((dataId: any, index: any) => (
                                <Link href={`/dashboard/user/${dataId.id}`} key={index}>
                                    <Card key={index} className={cn('my-3 p-2 flex flex-col items-start ', { 'font-medium text-l border-primary-backgroudPrimary ': dataId.id === params.id })}>
                                        <span className={cn('btn', { 'font-medium text-l text-primary-backgroudPrimary ': dataId.id === params.id })}>CMND/CCCD : {dataId.id}</span>
                                        <span className={cn('btn', { 'font-medium text-l text-primary-backgroudPrimary mb-5': dataId.id === params.id })}>NGƯỜI DÙNG : {dataId.firstName} {dataId.lastName}</span>
                                        <Separator className={cn('h-[2px]', { 'm bg-primary-backgroudPrimary ': dataId.id === params.id })} />
                                    </Card>
                                </Link>
                            ))
                        } */}

                    </div>
                </div>

                <div className="flex-1 border-l-8 border-slate-100">
                    <div className="p-3">
                        <div className="px-4 space-y-6 md:px-6">
                            <header className="space-y-1.5">
                                <div className="flex items-center space-x-4">
                                    {/* hiển thị ảnh bản thiết kế */}
                                    <div className="w-[40%] h-[500px] bg-primary-backgroudPrimary">

                                    </div>

                                    {/* hiển hị ảnh bản chính */}
                                    <div className="w-[60%] h-[500px] bg-primary-backgroudPrimary">

                                    </div>
                                </div>
                            </header>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">THÔNG TIN SẢN PHẨM</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Tên</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {/* {userId?.firstName} */}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Mã CODE</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {/* {userId?.roleId} */}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Giá Tiền</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {/* {userId?.dob} */}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Kích thước</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {/* {userId?.address} */}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Mô tả</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {/* {userId?.gender} */}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">ID sản phẩm</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {/* {userId?.id} */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
