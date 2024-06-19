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
import { productApi } from "@/apis/product.api";
import ImageDisplayID from "./ImageDisplayID";

export default function ProductIDPage() {

    //state
    const [loading, setLoading] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const [productId, setProductId] = useState<any>([])

    useEffect(() => {





        const fetchDataProductId = () => {
            setLoading(true);
            productApi.getProductId(params.id)
                .then(res => {
                    const userData = res.data.data;
                    setProductId(userData);
                    // setUserId(res.data.data);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchDataProductId()

    }, [params.id])


    console.log('iddd product', productId.imageResponses)



    return (
        <Card className="" >
            <div className="bg-white flex justify-between h-[825px] w-full overflow-auto">
                <div className="hidden md:flex flex-col p-3">
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

                <div className="flex-1 border-l-8 border-slate-100">
                    <div className="p-3">
                        <div className="px-4 space-y-6 md:px-6">
                            <header className="space-y-1.5">

                                    <div className="bg-primary-backgroudPrimary ">
                                    <ImageDisplayID images={productId?.imageResponses}/>
                                    </div>

                            </header>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">THÔNG TIN SẢN PHẨM</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Tên</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                                {productId?.name}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Mã CODE</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                            {productId?.code}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Giá Tiền</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                            {productId?.price}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Kích thước</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                            {productId?.size}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">Mô tả</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                            {productId?.description}
                                            </span>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-2">
                                            <Label htmlFor="name">ID sản phẩm</Label>
                                            <span className="text-gray-400 font-medium w-full py-2 border-solid border-2 border-gray-100 rounded-md px-1">
                                            {productId?.id}
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
